//Simple goal : file ayegi file system ke through ye mujhe local path dega usko cloudinary pe upload kar dunga, upload krne ke baad delete kr denge hamare server se
import fs from "fs"
import { v2 as cloudinary } from "cloudinary";

//fs.unlink --> delete file ( delete nahi hoti par map nikal jata h )





cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })
        //file has been uploaded successfully
        console.log("Successfully Uploaded on Cloudinary", response.url);

        return response

    } catch (error) {
        //agar upload nahi hoti ya kuch erro hoti h to jo locally saved temp file h usko delete kr do varna sab bhega ho jayega hamare server me 
        fs.unlinkSync(localFilePath) // remove the locally save temporary file as the upload opertion got failed
        return null
    }
}
  
export {uploadOnCloudinary}