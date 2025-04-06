import { Router } from 'express';
import {
  getAllAuthors,
  createAuthor,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} from '../controllers/author';
import { validateObjectId } from '../middlewares/validateObjectId';

const router = Router();

router.get('/', getAllAuthors);
router.post('/', createAuthor);
router.get('/:authorId', validateObjectId('authorId'), getAuthor);
router.put('/:authorId', validateObjectId('authorId'), updateAuthor);
router.delete('/:authorId', validateObjectId('authorId'), deleteAuthor);

export default router;
