//2. require('dotenv').config({path:'./env});
import dotenv from "dotenv";

//1. import mongoose from "mongoose";
//1. import {DB_NAME} from "./constants";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDB()











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