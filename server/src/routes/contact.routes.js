import express from "express";
import { searchContact } from "../controllers/contact.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";



const contactsRoutes = express.Router();

contactsRoutes.post("/search", verifyToken, searchContact);

export default contactsRoutes;