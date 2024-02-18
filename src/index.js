// require('dotenv').config({path : './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
dotenv.config({
  path : "./env"
})

connectDB()










/*
import express from "express";
const app = express();

//1 -> Jab bhi aap database se baat krne ki koshish krenge to problems aa sakti h (try catch me wrap karo or Promises use karo)
//2 -> Database is always in another continent time lagta h issliye Async Await lagana hi padega

function connectDB() {}

//database h to async await chahiye kyunki database h to time lagega
//Ifie Approach ye function ko immediately execute karna h
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR :Application not able to talk to Database");
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR : ", error);
    throw error;
  }
})();
*/