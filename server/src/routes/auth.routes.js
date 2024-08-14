import express from "express";
import { signup } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/sighnup", signup);

export default authRoutes;
