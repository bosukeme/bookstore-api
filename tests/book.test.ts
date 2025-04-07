import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import Book from '../src/models/book';

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
  });

  it('should create a new book', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        description: 'A book about testing',
        author: '67f1b6a160b6731321647600',
        genre: '67f1b68a60b67313216475fd',
      });
      
    expect(res.status).toBe(201);
    expect(res.body.book.title).toBe('Test Book');
  });

  it('should fetch all books', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.books)).toBe(true);
  });

});
