import express from "express";
import { addProfileImage, getUserData, login, signup } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/multer.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-data",verifyToken,getUserData);

authRoutes.post(
    "/add-profile-image",
    verifyToken,
    upload.single("profile-image"),
    addProfileImage
);

export default authRoutes;
