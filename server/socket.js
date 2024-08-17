import { Server as sockerIOServer } from "socket.io";
import dotenv from "dotenv";
import Message from "./src/models/message.model.js";
dotenv.config();


const setupSocket = (server) =>{
    const io = new sockerIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    
    const userSocketMap = new Map();
    const disconnect = (socket) => {
        // console.log("disconnect", socket.id);
    
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                io.emit("userStatus", { userId, status: "offline" });
                userSocketMap.forEach((socketId, existingUserId) => {
                    if (existingUserId !== userId) {
                        io.to(socket.id).emit("userStatus", {
                        userId: existingUserId,
                        status: "offline",
                        });
                    }
                });
                userSocketMap.delete(userId);
                break;
            }
        }
      };

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
    
        const createdMessage = new Message(message);
        await createdMessage.save();
    
        // Find the saved message and populate the fields
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id firstName lastName email image color")
            .populate("recipient", "id firstName lastName email image color");
    
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData);
            console.log("Message sent to recipient:", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
            console.log("Message sent to sender:", messageData);
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
    
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log("User connected",userId, socket.id);
        } else {
            console.log("userid not provided deuring connectionerror");
        }   
        socket.on("sendMessage",sendMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
}

export default setupSocket;