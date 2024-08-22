import mongoose,{Schema} from "mongoose";
import  jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true//helps to enable searching field on some field in a optimized way
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true//helps to enable searching field on some field in a optimized way
        },
        avatar:{
            type:String,//cloudinary url
            required:true,
        },
        coverImage:{
            type:String,//cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,'Password is required']
        },
        refreshToken:{
            type:String,            
        }
    },{timestamps:true})


    //arrow function does not have rference of this i.e, we do not know the context and save is to be performed on the schema so context  is necessary so do not use arrow function

    //direct encryption is not possible so we use some mongoose hooks. 

    userSchema.pre("save", async function(next){
        if(!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password,10)
        next()
    })

    userSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password,this.password)//return true or false
    }

    userSchema.methods.generateAccessToken = function(){
        return jwt.sign(
            {
                _id:this._id,
                email:this.email,
                username:this.username,
                fullname:this.fullname
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );
    };
    userSchema.methods.generateRefreshToken = function(){ 
        return jwt.sign(
        {
            _id:this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )}

export const User = mongoose.model("User",userSchema);