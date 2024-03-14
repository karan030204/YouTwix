// helper file banake rakhi h hamne - asyncHandler ki jab hame sab cheez me promises wagarh nahi likhna padega try catch wagarh nahi likhna hoga
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'

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
  const { fullname, username, email, password } = req.body;
  console.log("email: ", email);

  //    if (fullname === "") {
  //         throw new ApiError(400, "Full Name is required")
  //    }
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if(existedUser){
    throw new ApiError(409, "User with email or username already exist")
  }

 //req.files issiliye ayega kyunki hamne ek middleware laga rakha h route me jab me controller call kr rhe h jisse hame files ache se acces krne ko mile multer kya karta h locally file store krta h and jo file store kiya h uska original name mujhe return krta h 
//bohot kuch hoga isme png jpg ye sab validation wagarh kr sakte h par abhi nahi karenge ye ham local path le rhe h abhi hamne cloudinary pe nahi dala h
  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, " Avatar file is required")
  }

  //upload to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(400, "Avatar file is required");
  }

 const user = await  User.create({
    fullname,
    avatar : avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  //mongo automatic add krta h _id ko db me
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // jo cheez nikalni h usko aese likh do
  )



  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user ")
  }


  
  return res.status.json(
    new ApiResponse(200, createdUser, "user registered successfully")
  ) 

  

});

export { registerUser };
