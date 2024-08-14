import express from "express";
import { login, signup } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);


export default authRoutes;
