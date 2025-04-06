import { Request, Response, NextFunction } from 'express';
import Genre from '../models/genre';


export const getAllGenres = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genres = await Genre.find({});
    res.status(200).json({
      message: 'Genres Retrived Successfully',
      genres,
      count: genres.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createGenre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body;
    const existingGenre = await Genre.findOne({ name });

    if (existingGenre) {
      res.status(400).json({ error: 'Genre Already Exist' });
      return;
    }

    const genre = new Genre({ name, description });
    await genre.save();

    res.status(201).json({ message: 'Genre created sucessfully', genre });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGenre = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { genreId } = req.params;
    const genre = await Genre.findById(genreId);

    if (!genre) {
      res.status(404).json({ error: 'Genre ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Genre retrieved successfully', genre });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGenre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { genreId } = req.params;
    const { name, description } = req.body;
    const genre = await Genre.findByIdAndUpdate(
      genreId,
      { name, description },
      { new: true, runValidators: true },
    );

    if (!genre) {
      res.status(404).json({ error: 'Genre ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Genre updated successfully', genre });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGenre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { genreId } = req.params;
    const genre = await Genre.findByIdAndDelete(genreId);

    if (!genre) {
      res.status(404).json({ error: 'Genre ID does not exist' });
      return;
    }

    res.status(200).json({ message: 'Genre deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};