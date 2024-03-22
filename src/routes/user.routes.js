import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      // ye frontend aur backend engineer ke beech me discuss hona chahiye
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//SECURED ROUTES
//secured routes pehle verifyJWT kaam karega fir next() likha h issiliye usko pata chalega ki logoutUser access karo bohot sahi cheez h bhai sahab
router.route("/logout").post(verifyJWT, logoutUser);
//secured route h issiliye hamne middleware bhi add kr diya h jisme woh verify karega
router.route("/refresh-token").post(refreshAccessToken)
export default router;
