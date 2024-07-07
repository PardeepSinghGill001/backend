import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const generateAccessandRefreshTokens=async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        //when saving to the mongoDB model the fields with required=true kick in since we are not saving them now here so we set validateBeforeSave:false

        return {accessToken,refreshToken}        
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Refresh and Access tokens")
    }
}
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

const loginUser = asyncHandler(async (req,res) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token to be generated 
    //send the tokens to user in cookies

    const {email,username,password} = req.body

    if(!username || !email){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAccessandRefreshTokens(user._id)

    //making another database call because the reference to user in line - 105 
    //does not have the refresh token since the function to generate them is called in line - 117
    //an alternative to this was to update the existing reference user
    const loggedInUSer = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
        //the above two fields leave the cookie modification task only to the server
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUSer,accessToken,refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler( async (req,res) => {
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken:undefined
        }
        //set operator gives us an object to which we insert the fields we want to update and set does it
    },
    {
        new:true
    }
   ) 
   const options = {
    httpOnly: true,
    secure: true
    //the above two fields leave the cookie modification task only to the server
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {},"User logged Out"))
}) 

export {registerUser,
        loginUser,
        logoutUser
}