import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {IAuthRequest, IUser} from "../types/interfaces";

dotenv.config();

export const authenticateUser = (req: IAuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(" ")[1];
    if(!token) {
        res.status(401).json({error: "Access Denied. No Token Provided"});
        return;
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IUser;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or Expired Token" });
    }
}