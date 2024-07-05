import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true    
}))

//configuration to be set, middleware to be set
app.use(express.json({limit: "16kb"})) //json configured with express that is it accepts json
//Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.

app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())//cookieParser can be used to perform CRUD operation on user cookies. A way by which secure cookies are placed in the browser only by the server so only server can read or remove those cookies.


export  {app}