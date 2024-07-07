import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res) => {
   //get user details from frontend
   //validation-not empty
   //check if user already exists: username,email
   //check for images, check for avatar
   //upload them to cloudinary, avatr
   //create user object - create entry in db
   //remove password and refresh token field from response
   //check for user creation //is it a null response or user created actually
   //return response

   //data can come from json,form, url. The below code handles for json and form
   const {username,fullname,email,password}=req.body
   

   if(
    [fullname,email,username,password].some((field) => 
    field?.trim()==="")
   ){
    throw new ApiError(400,"All fields are required")
   }
   const existedUser= await User.findOne({
    $or:[{ username },{ email }]//return me the first document where the username and or email matches
   })
   //if user exists, i do not want to proceed, i will throw error
   if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
   }
   console.log(req.files);
   const avatarLocalPath=req.files?.avatar[0]?.path;//getting the path to which multer stored the file on our server
//    const coverImageLocalPath=req.files?.coverImage[0]?.path; 

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path
   }


   if(!avatarLocalPath){
     throw new ApiError(400, "Avatar file is required")
   }


   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400, "Avatar file is required")
   }

   const user =await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url||"",
    email,
    password,
    username:username.toLowerCase()
   })
   const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
   )   

})
export {registerUser}