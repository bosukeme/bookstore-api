import { Router } from 'express';
import {
  getAllGenres,
  createGenre,
  getGenre,
  updateGenre,
  deleteGenre,
} from '../controllers/genre';

import { validateObjectId } from '../middlewares/validateObjectId';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateUser, getAllGenres);
router.post('/', authenticateUser, createGenre);
router.get('/:genreId', authenticateUser, validateObjectId('genreId'), getGenre);
router.put(
  '/:genreId',
  authenticateUser,
  validateObjectId('genreId'),
  updateGenre,
);
router.delete(
  '/:genreId',
  authenticateUser,
  validateObjectId('genreId'),
  deleteGenre,
);

export default router;
