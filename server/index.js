import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes.js";
import contactsRoutes from "./src/routes/contact.routes.js";
import setupSocket from "./socket.js";


dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Success connect to DB");
    } catch (error) {
        console.log(error);
    }
};

const server = app.listen(PORT, () => {
    connectDB();

    console.log("Server is running in port " + PORT);
});

setupSocket(server);