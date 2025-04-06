import { Request, Response, NextFunction } from 'express';

import Author from '../models/author';

export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authors = await Author.find({});
    res.status(200).json({
      message: 'Authors Retrived Successfully',
      authors: authors,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, image, nationality } = req.body;
    const fullName = `${firstName} ${lastName}`;
    const existingAuthor = await Author.findOne({ fullName });

    if (existingAuthor) {
      res.status(400).json({ error: 'Author Already Exist' });
      return;
    }

    const author = new Author({ firstName, lastName, fullName, image, nationality });
    await author.save();

    res.status(201).json({ message: 'Author created sucessfully', author });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorId } = req.params;
    const author = await Author.findById(authorId);

    if (!author) {
      res.status(404).json({ error: 'Author ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Author retrieved successfully', author });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorId } = req.params;
    const { firstName, lastName, image, nationality } = req.body;
    const author = await Author.findByIdAndUpdate(
      authorId,
      { firstName, lastName, image, nationality },
      { new: true, runValidators: true },
    );

    if (!author) {
      res.status(404).json({ error: 'Author ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Author updated successfully', author });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorId } = req.params;
    const author = await Author.findByIdAndDelete(authorId);

    if (!author) {
      res.status(404).json({ error: 'Author ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};