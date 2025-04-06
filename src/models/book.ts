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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
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
