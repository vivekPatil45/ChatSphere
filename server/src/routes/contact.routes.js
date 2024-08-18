import express from "express";
import { getContactsForDMlist, searchContact } from "../controllers/contact.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";



const contactsRoutes = express.Router();

contactsRoutes.post("/search", verifyToken, searchContact);
contactsRoutes.get("/get-contact-for-dm", verifyToken, getContactsForDMlist);


export default contactsRoutes;