import mongoose, { Schema } from "mongoose";

import { IAuthor } from '../types/interfaces';


const AuthorSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    nationality: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IAuthor>('Author', AuthorSchema);
