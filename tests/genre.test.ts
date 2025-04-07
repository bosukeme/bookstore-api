import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import Genre from '../src/models/genre';

describe('Genre Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    await request(app).post('/api/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/login').send({
      username: 'testuser',
      password: 'password123',
    });

    token = res.body.token;
  });

  afterEach(async () => {
    await Genre.deleteMany({});
  });

  describe('POST /api/genres', () => {
    it('should create a new genre', async () => {
      const res = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Fantasy', description: 'Magical adventures' });

      expect(res.status).toBe(201);
      expect(res.body.genre.name).toBe('Fantasy');
    });

    it('should return 400 if genre already exists', async () => {
      await Genre.create({ name: 'Fantasy' });

      const res = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Fantasy' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Genre Already Exist');
    });

    it('should return 500 if there is an error creating a genres', async () => {
      jest
        .spyOn(Genre, 'findOne')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .post(`/api/genres/`)
        .set('Authorization', `Bearer ${token}`)
        .send({name: "Sci-Fi"});
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('GET /api/genres', () => {
    it('should return an empty list initially', async () => {
      const res = await request(app)
        .get('/api/genres')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.genres).toEqual([]);
    });

    it('should return genres after creation', async () => {
      await Genre.create({ name: 'Sci-Fi', description: 'Futuristic stuff' });

      const res = await request(app)
        .get('/api/genres')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.genres.length).toBe(1);
    });

    it('should return 500 if there is an error retrieving genres', async () => {
  
      jest
        .spyOn(Genre, 'find')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .get(`/api/genres/`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('GET /api/genres/:id', () => {
    it('should retrieve a genre by ID', async () => {
      const genre = await Genre.create({ name: 'Mystery' });

      const res = await request(app)
        .get(`/api/genres/${genre._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.genre.name).toBe('Mystery');
    });

    it('should return 404 for invalid ID', async () => {
      const res = await request(app)
        .get(`/api/genres/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 500 if there is an error retrieving a genre', async () => {
      const genre = await Genre.create({ name: 'Comedy' });

      jest
        .spyOn(Genre, 'findById')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .get(`/api/genres/${genre._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });
  });

  describe('PUT /api/genres/:id', () => {
    it('should update a genre', async () => {
      const genre = await Genre.create({ name: 'Drama' });

      const res = await request(app)
        .put(`/api/genres/${genre._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Drama', description: 'Updated desc' });

      expect(res.status).toBe(200);
      expect(res.body.genre.name).toBe('Updated Drama');
    });

    it('should return 404 for non-existing ID', async () => {
      const res = await request(app)
        .put(`/api/genres/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Anything' });

      expect(res.status).toBe(404);
    });

    it('should return 500 if there is an error updating a genre', async () => {
      const genre = await Genre.create({ name: 'Comedy' });

      jest
        .spyOn(Genre, 'findByIdAndUpdate')
        .mockRejectedValueOnce(new Error('Database Error'));

      const res = await request(app)
        .put(`/api/genres/${genre._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({name:"Fantasy"});
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Database Error');
    });

  });

  describe('DELETE /api/genres/:id', () => {
    it('should delete a genre', async () => {
      const genre = await Genre.create({ name: 'Comedy' });

      const res = await request(app)
        .delete(`/api/genres/${genre._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Genre deleted successfully');
    });

    it('should return 404 for non-existing ID', async () => {
      const res = await request(app)
        .delete(`/api/genres/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
    
    it('should return 500 if there is an error deleting a genre', async () => {
          const genre = await Genre.create({ name: 'Comedy' });
    
          jest
            .spyOn(Genre, 'findByIdAndDelete')
            .mockRejectedValueOnce(new Error('Database Error'));
    
          const res = await request(app)
            .delete(`/api/genres/${genre._id}`)
            .set('Authorization', `Bearer ${token}`);
          expect(res.status).toBe(500);
          expect(res.body.error).toBe('Database Error');
        });

  });
});
