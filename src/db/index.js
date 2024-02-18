import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// Db is in another continent issiliye async await
const connectDB = async () => {
    try {
        //Connection hone ke baad response ayega woh store ho jayega
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB Connected !! DB HOST ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED", error);
        process.exit(1)
    }
}


export default connectDB