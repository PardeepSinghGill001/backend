//a file that is uploaded to our server will have a local path
//that local pth will be given to cloudinary to upload it to cloudinary server
//once done that file is to be removed from our server
import {v2 as cloudinary} from "cloudinary";//cloudinary is now alias for v2
import fs from "fs";//fs is file system, comes in by default with node js

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:  process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async (localFilePath) => {
    try {
        if(!localFilePath) return null //no further steps to be taken
        const response =await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })
        //file upload successful
        console.log("file is uploaded on cloudinary",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed
        //unlinkSync implies, do the unlinking is synchronous way i.e, we will move forward once it is done
        return null;
    }
}
export {uploadOnCloudinary}

 