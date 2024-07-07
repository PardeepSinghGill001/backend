//2. require('dotenv').config({path:'./env});
import dotenv from "dotenv";


//1. import mongoose from "mongoose";
//1. import {DB_NAME} from "./constants";
import connectDB from "./db/index.js";
import {app} from "./app.js"


dotenv.config({
    path:'./.env'
})

//async method returns a promise upon completion
connectDB()
.then(() => {
    app.on("error",(error) => {//app.on("error", ...) sets up an event listener on the app object that listens for error events. The app object is likely an instance of an application, such as an Express.js application or another event emitter. When an error event is emitted, the callback function (error) => { ... } is executed.
        console.log("ERROR: ", error);
        throw error//This can be useful if you want to let higher-level error handlers deal with the error or if you want to crash the application intentionally when a critical error occurs.
    })
    app.listen(process.env.PORT||8000,() =>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!!", err);
})











/* 1.
import express from "express";
const app=express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error) => {
            console.log("ERROR:", error)
            throw error
        } )//db connected but express app not able to communicate

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
            
        })     
    } catch (error) {
        console.error("ERROR :",error);
        throw error
    }
})() */