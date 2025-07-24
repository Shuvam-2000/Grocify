import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { configDotenv } from "dotenv";

// load environment variables
configDotenv();

// new user registration
export const newUserRegister = async (req,res) => {
    try {
        const { name , email , password } = req.body;

        // check if all fields are provided
        if(!name || !email || !password) return res.status(400).json({
            message: 'All Fields Are Required',
            success: false
        })

        // check if user already exists
        const exisitingUser = await User.findOne({ email })
        if(exisitingUser) return res.status(400).json({
            message: 'User Already Exists',
            success: false
        })

        // hashing the passoword
        const hashedPassword = await bcrypt.hash(password, 10);

        // register new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User Registered Successfully",
            success: true,
            user: newUser
        });
        
    } catch (error) {
        console.error('Error', error.message)
        res.status(500).json({
        message: "Internal Server Error",
        success: false,
    });
    }
}

// user login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({
            message: "User Not Found",
            success: false,
        });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({
            message: "Invalid Credentials",
            success: false,
        });
        }

        const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );

        res.status(200).json({
        message: "Login Successful",
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        });

    } catch (error) {
        res.status(500).json({
        message: "Internal Server Error",
        success: false,
        });
    }
};