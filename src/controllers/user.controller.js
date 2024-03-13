// helper file banake rakhi h hamne - asyncHandler ki jab hame sab cheez me promises wagarh nahi likhna padega try catch wagarh nahi likhna hoga 
import {asyncHandler} from "../utils/asyncHandler.js"


const registerUser = asyncHandler( async (req,res) => {
    res.status(200).json({
        message : "ok"
    })
})

export {registerUser}