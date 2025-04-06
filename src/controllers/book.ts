import { Request, Response, NextFunction } from 'express';

import Book from '../models/book';

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const { title, author, genre, sortBy, sortOrder } = req.query;

    const filter: any = {};
    if (title) filter.title = { $regex: new RegExp(title as string, 'i') }; 
    if (author) filter.author = author;
    if (genre) filter.genre = genre;

    let sort: any = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      sort[sortBy as string] = order;
    }

    const books = await Book.find(filter).sort(sort);
    res.status(200).json({
      message: 'Books Retrieved Successful',
      books: books,
      count: books.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { author, title, genre, yearPub, image } = req.body;
    
    const existingBook = await Book.findOne({ title });

    if (existingBook) {
      res.status(400).json({ error: 'Book Title Already Exist' });
      return;
    }

    const book = new Book({ author, title, genre, yearPub, image });
    await book.save();

    res.status(201).json({ message: 'Book created sucessfully', book });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      res.status(404).json({ error: 'Book ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Book retrieved successfully', book });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookId } = req.params;
    const { title, author, genre } = req.body;
    const book = await Book.findByIdAndUpdate(
      bookId,
      { title, author, genre },
      { new: true, runValidators: true },
    );

    if (!book) {
      res.status(404).json({ error: 'Book ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      res.status(404).json({ error: 'Book ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};