import multer from "multer";

//middleware h kyunki reusable ho and har jagah use krenge
const storage = multer.diskStorage({
    //file -> saari files ye multer ke paas hi hota h
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })

  // task
  export const upload = multer({ 
    storage,
 })