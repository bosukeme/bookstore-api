import { Request } from 'express';
import mongoose, { Document } from "mongoose";


// user
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
  refreshToken: string;
  comparePassword(candidatePassword: string): Promise<boolean>?;
}

export interface IAuthRequest extends Request {
    user?: IUser;
}


// book
export interface IBook extends Document {
    title: string;
    author: string;
    genre: string;
    yearPub: string;
    image: string;
}


// author
export interface IAuthor extends Document {
  firstName: string;
  lastName: string;
  image: string;
  nationality: string;
}

// genre
export interface IGenre extends Document {
  name: string;
  description: string;
}
