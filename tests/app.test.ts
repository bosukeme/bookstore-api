import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
  it('should return the Home page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('BOOKAPI Endpoint Home');
  });
});
