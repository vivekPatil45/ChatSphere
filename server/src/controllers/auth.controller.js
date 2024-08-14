import jwt from "jsonwebtoken";
import User from "../user.model.js";

const maxExp = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxExp,
    });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const alreadyExist = await User.findOne({ email });

        if (alreadyExist) {
            return res.status(400).json({ message: "Email already exits" });
        }

        const newUser = new User({ email, password });

        const user = await newUser.save();
        res.cookie("jwt", createToken(email, user.id), {
            maxExp,
            secure: true,
            sameSite: "None",
        });
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
};
