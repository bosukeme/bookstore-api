import mongoose, { Schema } from "mongoose";

import { IGenre } from '../types/interfaces';


const GenreSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    }
  },
  { timestamps: true },
);

export default mongoose.model<IGenre>('Genre', GenreSchema);
