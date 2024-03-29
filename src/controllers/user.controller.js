// helper file banake rakhi h hamne - asyncHandler ki jab hame sab cheez me promises wagarh nahi likhna padega try catch wagarh nahi likhna hoga
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

//refresh token and access token me user_id ka bohot imp role h to woh to pass krna hi padega
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went Wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response : db me jab bhi ham banate h tab poora object response aata h jo bhi db me bana h to hame password aur refresh token nahi bhejna h
  // check for user creation
  // return res

  //destructuring
  const { fullName, username, email, password } = req.body;
  console.log("email: ", email);

  //    if (fullname === "") {
  //         throw new ApiError(400, "Full Name is required")
  //    }
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  //   console.log(req.body);

  //req.files issiliye ayega kyunki hamne ek middleware laga rakha h route me jab me controller call kr rhe h jisse hame files ache se acces krne ko mile multer kya karta h locally file store krta h and jo file store kiya h uska original name mujhe return krta h
  //bohot kuch hoga isme png jpg ye sab validation wagarh kr sakte h par abhi nahi karenge ye ham local path le rhe h abhi hamne cloudinary pe nahi dala h
  //optional checking
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path

  let coverImageLocalPath;
  //classic tareeka
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, " Avatar file is required");
  }

  //upload to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //mongo automatic add krta h _id ko db me
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // jo cheez nikalni h usko aese likh do
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //Todo : 
  // req body -> data
  // username or email
  // find the user
  // password check
  // access token and refresh token -> user
  // send via cookies

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  //pehla document mil jayega to return kr dega match krta hua
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "Record not found");
  }

  // if(!(user.password === password)){
  //   throw new ApiError(400,"Password is Wrong")
  // }

  // abhi main cheez agar hame hamare methods ko access krna h to ham use User se nahi karenge ham usko hamare user ke instance se karenge jo ham le rhe h db se to small user ayega not User
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  //ye dusri baar kiya kyunki hamare paas jo user ka reference h usme refreshToken emptyj che so ya to e object ne update kari sakiye ya to new db query kari sakiye kuch bhi kr sakte h but hame dekhna hoga ki kiska computation cost kam h uske isaab e dekh lenge
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //sending via cookie
  const options = {
    //only modifiable by server
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async(req,res)=>{
    //middleware -> ja rhe ho to milke jana
    //pehla middleware design krte h chalo
    // ham middleware se aaye h to hamare paas user ka access h via req.user se 

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set : {
          refreshToken : undefined
        }
      },
      {
        new : true
      }
    )

    const options = {
      httpOnly : true,
      secure : true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
      new ApiResponse(200,{},"User Logged Out Successfully")
    )
})


//route for refreshing access token
const refreshAccessToken = asyncHandler(async(req,res)=>{
  // refreshToken
  // cookie se access 
  // check db - refreshToken
  // call the method for generate access token

  const incomginRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomginRefreshToken){
    throw new ApiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomginRefreshToken, process.env.REFRESH_TOKEN_SECRET
    )
  
    const user = await User.findById(decodedToken?._id)
  
    //match krne ke liye db me jo stored h refresh token woh bhi to chahiye
    if(!user){
      throw new ApiError(401,"Invalid Refresh Token")
    }
  
  
    if(incomginRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Refresh token is expired or used")
    }
  
    const options = {
      httpOnly : true,
      secure : true
    }
  
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {accessToken,refreshToken : newRefreshToken},
        "Access Token refreshed Successfully"
        )
    )
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Refresh Token") 
  }






  





})
export { registerUser, loginUser, logoutUser, refreshAccessToken };
