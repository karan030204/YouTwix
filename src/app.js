import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


//middleware y configure
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


//alag alag forms me data aa sakta h backend me json,searchquery, files & folders to usiko handle krne ke liye alag alag middlewares and uske liye limit lagayi h 

//Setup ho gaya
//limit lagani h
//json ko accept kr rha hun ki itna hi json bhejo varna server crash ho jayega // pehle json accept krne ke liye body-parser use krna padta tha express me but abhi woh kr rha h accept
app.use(express.json({limit : "16kb"}))

//url se jab data aata h thoda issue hota h hitesh + chaudhary ho jaata h ya fir hitesh%20 chaudhary ho jaata h
app.use(express.urlencoded({extended:true, limit : "16kb"}))

//files folder images -> store krna chahte h to woh me public me daal dunga issiliye static use krte h 
app.use(express.static("public"))

//cookie-parser ka kaam itna hi h ki user ke browser me se cookie ko access kr paun aur set bhi kar paun mere server se user ke browser me itna hi kaam h cookie-parser ka
app.use(cookieParser())
// cookieParser ki help se ham -> .cookie access kr paa rhe h 

 
//beech ki checking ko hi middleware bolte h 
// /instagram -> checking ( if user is loggedIn or not ) -> if loggedIn then sending to server route jahan pe (req,res) ho rha h
//(err,req,res,next)
// next flag hona zaruri h matlab jaise hi kaam ho jaye next paas krdo


//routes import 

import userRouter from "./routes/user.routes.js"


//routes declaration
// pehle ham app.get par tab ham controller aur routes yahin likh rhe the issiliye chal jaata tha
//api hamari konsa version h ye sab cheeze batana zarooori h achi practice h standard practice h
app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users/register

export default app 