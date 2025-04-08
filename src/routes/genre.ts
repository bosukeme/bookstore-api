import { Router } from 'express';
import {
  getAllGenres,
  createGenre,
  getGenre,
  updateGenre,
  deleteGenre,
} from '../controllers/genre';

import { validateObjectId } from '../middlewares/validateObjectId';

const router = Router();

router.get('/', getAllGenres);
router.post('/', createGenre);
router.get('/:genreId', validateObjectId('genreId'), getGenre);
router.put(
  '/:genreId',

  validateObjectId('genreId'),
  updateGenre,
);
router.delete(
  '/:genreId',

  validateObjectId('genreId'),
  deleteGenre,
);

export default router;
