import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import Author from '../src/models/author';

describe('Author Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    await request(app).post('/api/register').send({
      username: 'authoruser',
      email: 'author@example.com',
      password: 'authorpass',
    });

    const res = await request(app).post('/api/login').send({
      username: 'authoruser',
      password: 'authorpass',
    });

    token = res.body.token;
  });

  afterEach(async () => {
    await Author.deleteMany({});
  });

  describe('POST /api/authors', () => {
    it('should create a new author', async () => {
      const res = await request(app)
        .post('/api/authors')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Test Author',
          lastName: 'Paul',
          image: 'http://image.com',
          nationality: 'USA',
        });

      expect(res.status).toBe(201);
      expect(res.body.author.firstName).toBe('Test Author');
    });

    it('should return 400 if author already exists', async () => {
      const firstName = 'Test Author';
      const lastName = 'Paul';
      const fullName = `${firstName} ${lastName}`;
      await Author.create({ firstName, lastName, fullName });

      const res = await request(app)
        .post('/api/authors')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName, lastName, fullName });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Author Already Exist');
    });

    it('should return 500 if there is an error creating authors', async () => {
      jest
        .spyOn(Author, 'findOne')
        .mockRejectedValueOnce(new Error('Database Error'));
      const res = await request(app)
        .post('/api/authors')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Test', lastName: 'Author' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('GET /api/authors', () => {
    it('should return an empty list initially', async () => {
      const res = await request(app)
        .get('/api/authors')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.authors).toEqual([]);
      expect(Array.isArray(res.body.authors)).toBe(true);
    });

    it('should return authors after creation', async () => {
      const firstName = 'Test';
      const lastName = 'Author';
      const fullName = `${firstName} ${lastName}`;
      await Author.create({ firstName, lastName, fullName });

      const res = await request(app)
        .get('/api/authors')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.authors.length).toBe(1);
    });

    it('should return 500 if there is an error retrieving authors', async () => {
      jest.spyOn(Author, 'find').mockRejectedValueOnce(new Error('Database Error'));
      const res = await request(app)
        .get('/api/authors')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('GET /api/authors/:id', () => {
    it('should retrieve an author by ID', async () => {
      const firstName = 'Test';
      const lastName = 'Author';
      const fullName = `${firstName} ${lastName}`;
      const author = await Author.create({ firstName, lastName, fullName });

      const res = await request(app)
        .get(`/api/authors/${author._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.author.lastName).toBe('Author');
    });

    it('should return 404 for invalid ID', async () => {
      const res = await request(app)
        .get(`/api/authors/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 500 if there is an error retrieving an author', async () => {
      const firstName = 'Test';
      const lastName = 'Author';
      const fullName = `${firstName} ${lastName}`;
      const author = await Author.create({ firstName, lastName, fullName });
      
      jest
        .spyOn(Author, 'findOne')
        .mockRejectedValueOnce(new Error('Database Error'));


      const res = await request(app)
        .get(`/api/authors/${author._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('PUT /api/authors/:id', () => {
    it('should update an author', async () => {
      const firstName = 'Test';
      const lastName = 'Author';
      const fullName = `${firstName} ${lastName}`;
      const author = await Author.create({ firstName, lastName, fullName });

      const res = await request(app)
        .put(`/api/authors/${author._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Updated Test', lastName: 'Updated Author' });

      expect(res.status).toBe(200);
      expect(res.body.author.firstName).toBe('Updated Test');
    });

    it('should return 404 for non-existing ID', async () => {
      const res = await request(app)
        .put(`/api/authors/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Anything' });

      expect(res.status).toBe(404);
    });

    it('should return 500 if there is an error updating an author', async () => {
      const firstName = 'Test';
      const lastName = 'Author';
      const fullName = `${firstName} ${lastName}`;
      const author = await Author.create({ firstName, lastName, fullName });

      jest
        .spyOn(Author, 'findByIdAndUpdate')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .put(`/api/authors/${author._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Updated Test', lastName: 'Updated Author' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('DELETE /api/authors/:id', () => {
    it('should delete a author', async () => {
      const firstName = 'Test';
      const lastName = 'Author';
      const fullName = `${firstName} ${lastName}`;
      const author = await Author.create({ firstName, lastName, fullName });

      const res = await request(app)
        .delete(`/api/authors/${author._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Author deleted successfully');
    });

    it('should return 404 for non-existing ID', async () => {
      const res = await request(app)
        .delete(`/api/authors/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 500 if there is an error deleting an author', async () => {
      const firstName = 'Test';
      const lastName = 'Author';
      const fullName = `${firstName} ${lastName}`;
      const author = await Author.create({ firstName, lastName, fullName });

      jest
        .spyOn(Author, 'findByIdAndDelete')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .delete(`/api/authors/${author._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });
});
