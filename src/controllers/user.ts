import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/user";
import {IUser} from "../types/interfaces";

dotenv.config();


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {username, email, password} = req.body;

        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                res.status(400).json({error: 'Email already in use'});
                return;
            }
            res.status(400).json({error: 'Username already in use'});
            return;
        }

        const user = new User({username, email, password})
        await user.save();

        const userResponse = {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        };
        res.status(201).json({message: "User Registered Successfully", userResponse})
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }
}


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const {username, password} = req.body;
    
        const existingUser = await User.findOne({username});
    
        if (!existingUser) {
            res.status(404).json({error: "Invalid Username or Password"})
            return;
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            res.status(400).json({error: "Invalid Username or Password"});
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        
        const token = jwt.sign(
            {id: existingUser._id, username: existingUser.username},
            process.env.JWT_SECRET as string,
            { 
                expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string)  || 3600, 
            }   
        );

        const refreshToken = jwt.sign(
          { id: existingUser._id, username: existingUser.username },
          process.env.JWT_REFRESH_SECRET as string,
          {
            expiresIn:
              parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string) ||
              7 * 24 * 60 * 60
          },
        );

        await User.findByIdAndUpdate(
          existingUser._id,
          { token, refreshToken },
          { new: true, runValidators: true },
        );
        
        res.status(200).json({
          message: 'Login Successful',
          token,
          user: {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            createdAt: existingUser.createdAt,
          },
        });

    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}
