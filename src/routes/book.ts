import { Router } from 'express';
import {
  getAllBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
} from '../controllers/book';

import { validateObjectId } from '../middlewares/validateObjectId';

const router = Router();

router.get('/', getAllBooks);
router.post('/', createBook);
router.get('/:bookId', validateObjectId('bookId'), getBook);
router.put(
  '/:bookId',

  validateObjectId('bookId'),
  updateBook,
);
router.delete(
  '/:bookId',

  validateObjectId('bookId'),
  deleteBook,
);

export default router;
