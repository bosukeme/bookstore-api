import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';


export const validateObjectId = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[paramName];

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({error: `Invalid ${paramName} (Object Id) format`});
            return;
        }
        next();
    };
};