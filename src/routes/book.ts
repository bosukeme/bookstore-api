import { Router } from 'express';
import {
  getAllBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
} from '../controllers/book';

import { validateObjectId } from '../middlewares/validateObjectId';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateUser, getAllBooks);
router.post('/', authenticateUser, createBook);
router.get('/:bookId', authenticateUser, validateObjectId('bookId'), getBook);
router.put(
  '/:bookId',
  authenticateUser,
  validateObjectId('bookId'),
  updateBook,
);
router.delete(
  '/:bookId',
  authenticateUser,
  validateObjectId('bookId'),
  deleteBook,
);

export default router;
