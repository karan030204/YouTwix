import mongoose,{Schema} from "mongoose";

//ye model ko use kahan karenge ye apne aap me ek complexity h 
const subscriptionSchema = new Schema({

    subscriber : {
        type : Schema.Types.ObjectId, // one who is subscribing
        ref : "User"
    },
    channel : {
        type : Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing 
        ref : "User"
    }


},{timestamps:true})


export const Subcription = mongoose.model("Subscription",subscriptionSchema)