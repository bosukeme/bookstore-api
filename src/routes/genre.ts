import { Router } from 'express';
import {
  getAllGenres,
  createGenre,
  getGenre,
  updateGenre,
  deleteGenre,
} from '../controllers/genre';

const router = Router();

router.get('/', getAllGenres);
router.post('/', createGenre);
router.get('/:genreId', getGenre);
router.put('/:genreId', updateGenre);
router.delete('/:genreId', deleteGenre);

export default router;
