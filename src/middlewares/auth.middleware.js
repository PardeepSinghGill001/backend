import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
//this middleware will check if user is or isn't
//next basically means, the work here is done now take it to the next middleware if it be or to response.... 
export const verifyjwt = asyncHandler(async (req,_,next) => {
    //here req and next are being used and res is empty so we replce it with '_'
    //production grade !!

    try {
        //maybe in case of mobile applications, the accessToken is not present and the user is sending a custom header so we do optional checking "?"
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        //if there be such syntax, Authorization:Bearer <Token> replace the right hand side with an empty string
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401 , error?.message||"Invalid access token")
    }

})