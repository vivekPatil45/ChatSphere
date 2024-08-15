import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from 'dotenv';
import { validate } from "../validations/validation.js";
import { signInValidate, signUpValidate } from "../validations/authValidation.js";
import { compare } from "bcrypt";
import { errorHandler } from "../utils/error.js";

dotenv.config();

const maxAge = 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    const secret = process.env.JWT_KEY;
    if (!secret) {
        throw new Error("JWT_KEY is not defined");
    }
    const jwtExpiration = 24 * 60 * 60;
    return jwt.sign({ email, userId }, secret, { expiresIn: jwtExpiration });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        validate(signUpValidate, req.body);

        const alreadyExist = await User.findOne({ email });

        if (alreadyExist) {
            return next(errorHandler(400, "Email has been taken")); // Use return to prevent further code execution
        }

        const newUser = new User({ email, password });

        const user = await newUser.save();
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return res.status(201).json({
            user: {
                _id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
            message: "Successfully created account",
        });
    } catch (error) {
        return next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        validate(signInValidate, req.body);

        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, "User not found")); // Use return to prevent further code execution
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return next(errorHandler(400, "Invalid password")); // Use return to prevent further code execution
        }
  
        res.cookie("jwt", createToken(email, user.id), {
            maxAge: maxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
  
        const {
            _id,
            email: emails,
            profileSetup,
            firstName,
            lastName,
            image,
            color,
        } = user._doc;
  
        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
                _id,
                email: emails,
                profileSetup,
                firstName,
                lastName,
                image,
                color,
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const getUserData = async (req, res, next) => {
    try {
        const userId = req.userId;
    
        const user = await User.findById(userId).select("-password");
  
        if (!user) {
            return next(errorHandler(404, "User not found."));
        }
        
  
        user.id = userId;
        const { password, ...rest } = user._doc;
        return res.status(200).json({
            succes: true,
            message: "success get data",
            user:rest,
        });
    } catch (error) {
        next(error);
    }
};