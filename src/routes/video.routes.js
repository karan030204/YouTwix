import express from "express";

import { Router } from "express";
import {
    deleteVideo,
  getVideoById,
  publishAVideo,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//Apply verifyJWT middleware to all the routes in this file 
router.use(verifyJWT)

router.route("/upload-video").post(

  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

//params se le rhe h issiliye hame isko aese likhenge /:videoId jis parameter se hame lena h woh likhenge
router.route("/getVideo/:videoId").get( getVideoById);

router
  .route("/update-video/:videoId")
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/delete-video/:videoId").post( deleteVideo)


export default router;
