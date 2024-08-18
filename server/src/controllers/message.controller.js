import Message from "../models/message.model.js";
import { errorHandler } from "../utils/error.js";

export const getMessage = async (req, res, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            return  next(errorHandler(400,"Both user Id's are required"));
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};