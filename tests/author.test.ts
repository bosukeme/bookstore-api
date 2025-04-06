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
        const lastName =  'Paul';
        const fullName = `${firstName} ${lastName}`;
          await Author.create({ firstName, lastName, fullName });
    
          const res = await request(app)
            .post('/api/authors')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName, lastName, fullName });
          expect(res.status).toBe(400);
          expect(res.body.error).toBe('Author Already Exist');
        });


  });

  

  it('should fetch all authors', async () => {
    const res = await request(app)
      .get('/api/authors')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.authors)).toBe(true);
  });

  
});
