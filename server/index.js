import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes.js";


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



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Success connect to DB");
    } catch (error) {
        console.log(error);
    }
};

app.listen(PORT, () => {
    connectDB();

    console.log("Server is running in port " + PORT);
});