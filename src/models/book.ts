import mongoose, { Schema } from "mongoose";

import { IBook } from "../types/interfaces";


const BookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
    },
    yearPub: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IBook>('Book', BookSchema);
