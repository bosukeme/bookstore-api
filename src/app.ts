import express from "express";
import { Request, Response } from "express";

import userRoutes from './routes/user';
import bookRoutes from './routes/book';
import authorRoutes from './routes/author';
import genreRoutes from './routes/genre';

import { errorHandler } from "./middlewares/errorHandler";
import {authenticateUser} from "./middlewares/authMiddleware";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("BOOKAPI Endpoint Home")
})

app.use('/api', userRoutes);

app.use(authenticateUser);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);

app.use(errorHandler);

export default app;