import express from 'express';
import {verifyToken} from '../middlewares/auth.middleware.js'
import {getMessage} from '../controllers/message.controller.js'

const messageRoutes = express.Router();

messageRoutes.post("/get-messages",verifyToken,getMessage);

export default messageRoutes;
