// import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt"
// //direct encryption nahi ho sakta uske liye aapko hooks chahiye hote h 

// //pre hook - middleware jaise hi aapaka data save hone ja rha usse just pehle kuch bhi karva sakte ho aap

// const userSchema = new Schema({
//     username : {
//         type : String,
//         required : true,
//         unique : true,
//         lowercase : true,
//         trim:true,
//         //Searchable : index - true kr do kyunki searching me use krne vaale ho toh index : true agar searchable field krna chate ho toh - waise bhi hota h but optimise kr deta hai
//         index:true
//     },
//     email : {
//         type : String,
//         required : true,
//         unique : true,
//         lowercase : true,
//         trim:true,
//     },
//     fullname : {
//         type : String,
//         required : true,
//         trim:true,
//         index:true
//     },
//     avatar : {
//         type : String, // cloudinary url ( upload krke url de dega )
//         required : true,
//     },
//     coverImage : {
//         type : String, // cloudinary url
//     },
//     watchHistory : [
//         {
//             type : Schema.Types.ObjectId,
//             ref : "Video"
//         }
//     ],
//     password : {
//         type : String,
//         required : [true, "Password is Required"]
//     },
//     refreshToken : {
//         type : String
//     }
    
// }, { timestamps: true });

// //pre ek middleware che 
// // isme ek pbm h ki jab bhi user kuch change karega jaise ki coverImage change kiya ya kuch bhi kiya to har baar paswd save hoga change hoga har baar par hame har baar thodi change karvana h passwiord hame sirf first baar and jab new password generate krna ho tab karo varna ye to baar hash karta hi jayega jab bhi user kuch change karega aur save krne ko bolega db me issiliye ham check lagayenge isme ki password pehli baar ya afir new pswd h to hi pswd hash karenge
// // save ho usse pehle kuch kaam karvana h mereko to event -> save
// // arrow fn ke ander apne paas this ka reference nahi pata hota h to dhyan rakhna pre ke ander arrow function use krna avoid karna arrows fn ko this ka reference nahi pata context nahi pata 
// // function use kiya h to uske paas context h saari fields ka and sab to aap this. use kr sakte ho aur usme jo field aapko leni h woh le sakte ho isiko hi Hook bolte h
// // bcrypt me time lagta h issiliye hamne async use kiya h 
// userSchema.pre("save", async function(next){
//     if(!this.isModified("password")) return next()

//     this.password = await bcrypt.hash(this.password,10)
//     next()
// })

// //import karvayenge tab password check karvane ke liye kyunki ye to hash krke store kr rha h
// userSchema.methods.isPasswordCorrect = async function(password){
//     return await bcrypt.compare(password,this.password)
// }

// //dono hi jwt tokens h
// userSchema.methods.generateAccessToken = function (){
//     return jwt.sign(
//         //payload or data
//         {
//             _id : this._id, // by default property of mongo
//             email : this.email,
//             username : this.username,
//             fullname: this.fullname
//         },
//         //access token che
//             process.env.ACCESS_TOKEN_SECRET,
//             //access token ni expiry che
//             {
//                 expiresIn : process.env.ACCESS_TOKEN_EXPIRY
//             }
        
//     )
// }

// ``
// userSchema.methods.generateRefreshToken= function (){
//     return jwt.sign(
//         //payload
//         {
//             _id : this._id,
//         },
//         //refresh token che
//             process.env.REFRESH_TOKEN_SECRET,
//             //refresh token ni expiry che
//             {
//                 expiresIn : process.env.REFRESH_TOKEN_EXPIRY
//             }
        
//     )
// }


// export const User = new mongoose.model("User", userSchema);


// // jwt ek bearer token h - chabi ki tarah h (jo lekar ayega usko de denge)


import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)