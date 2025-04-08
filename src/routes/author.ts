import { Router } from 'express';
import {
  getAllAuthors,
  createAuthor,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} from '../controllers/author';
import { validateObjectId } from '../middlewares/validateObjectId';
import { authenticateUser } from '../middlewares/authMiddleware';


const router = Router();

router.get('/', authenticateUser, getAllAuthors);
router.post('/', authenticateUser, createAuthor);
router.get(
  '/:authorId',
  authenticateUser,
  validateObjectId('authorId'),
  getAuthor,
);
router.put(
  '/:authorId',
  authenticateUser,
  validateObjectId('authorId'),
  updateAuthor,
);
router.delete(
  '/:authorId',
  authenticateUser,
  validateObjectId('authorId'),
  deleteAuthor,
);

export default router;
