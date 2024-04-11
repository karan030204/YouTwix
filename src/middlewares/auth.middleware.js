import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

//ye sirf verify karega user h ki nahi loggedIn h ki nahi
export const verifyJWT = asyncHandler(async(req, _ ,next)=>{
    // ? -> optional
    //cookies ka access hamare paas req me h to ham usse cookies ka access le lenge
    try {
        // console.log(req.header("Authorization"));
        // console.log(req.cookies);
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        //token h to jwt se puchna padega token sahi h ya nahi
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            //TODO : discuss about frontend
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }




})



