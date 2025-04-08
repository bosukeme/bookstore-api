import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import Book from '../src/models/book';
import Genre from '../src/models/genre';
import Author from '../src/models/author';


describe('Book Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    await request(app).post('/api/register').send({
      username: 'bookuser',
      email: 'book@example.com',
      password: 'bookpass',
    });

    const res = await request(app).post('/api/login').send({
      username: 'bookuser',
      password: 'bookpass',
    });

    token = res.body.token;
  });

  afterEach(async () => {
    await Book.deleteMany({});
    await Author.deleteMany({});
    await Genre.deleteMany({});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const bookData = {
        title: 'Test Book',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
        pubYear: '2000',
        image: 'localhost.png',
      };
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(bookData);

      expect(res.status).toBe(201);
      expect(res.body.book.title).toBe('Test Book');
    });

    it('should return 400 if book already exists', async () => {
      const bookData = {
        title: 'Test Book',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
        pubYear: '2000',
        image: 'localhost.png',
      };
      await Book.create(bookData);

      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(bookData);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Book Title Already Exist');
    });

    it('should return 500 if there is an error creating a book', async () => {
      jest
        .spyOn(Book, 'findOne')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .post(`/api/books/`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Book' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('GET /api/books', () => {
    it('should return an empty list initially', async () => {
      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.books).toEqual([]);
    });

    it('should return books after creation', async () => {
      const author = await Author.create({
        _id: new mongoose.Types.ObjectId('67f1b6a160b6731321647600'),
        firstName: 'John',
        lastName: 'Doe',
      });

      const genre = await Genre.create({
        _id: new mongoose.Types.ObjectId('67f1b68a60b67313216475fd'),
        name: 'Fiction',
      });

      
      const bookData = {
        title: 'Test Book',
        author: author._id,
        genre: genre._id,
        pubYear: '2000',
        image: 'localhost.png',
      };
      await Book.create(bookData);

      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.books.length).toBe(1);
    });

    it('should return 500 if there is an error retrieving books', async () => {
      
      jest
        .spyOn(Book, 'aggregate')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .get(`/api/books`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });

    it('should return books sorted by title', async () => {
      const author = await Author.create({
        _id: new mongoose.Types.ObjectId('67f1b6a160b6731321647600'),
        firstName: 'John',
        lastName: 'Doe',
      });

      const genre = await Genre.create({
        _id: new mongoose.Types.ObjectId('67f1b68a60b67313216475fd'),
        name: 'Fiction',
      });


      await Book.create({
        title: 'Unique Title',
        author: author._id,
        genre: genre._id,
        pubYear: '2000',
        image: 'img.png',
      });
      const res = await request(app)
        .get('/api/books?title=unique')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.books.length).toBe(1);
      expect(res.body.books[0].title).toBe('Unique Title');
    });

    it('should return books sorted by title', async () => {
      const author = await Author.create({
        _id: new mongoose.Types.ObjectId('67f1b6a160b6731321647600'),
        firstName: 'John',
        lastName: 'Doe',
      });

      const genre = await Genre.create({
        _id: new mongoose.Types.ObjectId('67f1b68a60b67313216475fd'),
        name: 'Fiction',
      });


      await Book.create([
        {
          title: 'B Book',
          author: author._id,
          genre: genre._id,
          pubYear: '2000',
          image: 'img.png',
        },
        {
          title: 'A Book',
          author: author._id,
          genre: genre._id,
          pubYear: '2001',
          image: 'img.png',
        },
      ]);

      const res = await request(app)
        .get('/api/books?sortBy=title&sortOrder=asc')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.books[0].title).toBe('A Book');
    });


  });

  describe('GET /api/books/:id', () => {
    it('should retrieve a book by ID', async () => {
      const bookData = {
        title: 'Test Book',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
        pubYear: '2000',
        image: 'localhost.png',
      };
      const book = await Book.create(bookData);

      const res = await request(app)
        .get(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.book.title).toBe('Test Book');
    });

    it('should return 404 for invalid ID', async () => {
      const res = await request(app)
        .get(`/api/books/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 500 if there is an error retrieving a book', async () => {
      const bookData = {
        title: 'Test Book',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
        pubYear: '2000',
        image: 'localhost.png',
      };
      const book = await Book.create(bookData);

      jest.spyOn(Book, 'findById').mockImplementationOnce(
        () =>
          ({
            populate: () => ({
              populate: () => {
                throw new Error('Database Error');
              },
            }),
          }) as any,
      );

      const res = await request(app)
        .get(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update a book', async () => {
      const bookData = {
        title: 'Test Book',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
        pubYear: '2000',
        image: 'localhost.png',
      };
      const book = await Book.create(bookData);

      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated title' });

      expect(res.status).toBe(200);
      expect(res.body.book.title).toBe('Updated title');
    });

    it('should return 404 for non-existing ID', async () => {
      
      const res = await request(app)
        .put(`/api/books/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Anything' });

      expect(res.status).toBe(404);
    });

    it('should return 500 if there is an error updating a book', async () => {
      const bookData = {
        title: 'Test Book',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
        pubYear: '2000',
        image: 'localhost.png',
      };
      const book = await Book.create(bookData);

      jest
        .spyOn(Book, 'findByIdAndUpdate')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(bookData);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      const bookData = {
        title: 'Test Book',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
        pubYear: '2000',
        image: 'localhost.png',
      };
      const book = await Book.create(bookData);

      const res = await request(app)
        .delete(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Book deleted successfully');
    });

    it('should return 404 for non-existing ID', async () => {
      const res = await request(app)
        .delete(`/api/books/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 500 if there is an error deleting a book', async () => {
      const bookData = {
        title: 'Test Book',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
        pubYear: '2000',
        image: 'localhost.png',
      };
      const book = await Book.create(bookData);

      jest
        .spyOn(Book, 'findByIdAndDelete')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .delete(`/api/books/${book._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

});
