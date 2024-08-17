import { Server as sockerIOServer } from "socket.io";
import dotenv from "dotenv";
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
        console.log("disconnect", socket.id);
    
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
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
        socket.on("disconnect", () => disconnect(socket));
    });
}

export default setupSocket;