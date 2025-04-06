import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user';


const userData = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
};

describe("Auth Routes", () => {
    describe('POST /register', () => {
        it("Should register a new user", async () => {
            const res = await request(app).post("/api/register").send(userData);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty(
              'message',
              'User Registered Successfully',
            );
            expect(res.body.userResponse).toMatchObject({
              username: userData.username,
              email: userData.email,
            });

        });

        it('should not allow duplicate email', async () => {
          await new User(userData).save();

          const res = await request(app)
            .post('/api/register')
            .send(userData);
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('error', 'Email already in use');
        });
    });

    describe('POST /login', () => {
      beforeEach(async () => {
        await request(app).post('/api/register').send(userData);
      });

      it('should login successfully', async () => {
        const res = await request(app)
          .post('/api/login')
          .send({ username: userData.username, password: userData.password });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
      });

      it('should fail with wrong password', async () => {
        const res = await request(app)
          .post('/api/login')
          .send({ username: userData.username, password: 'wrongpassword' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
          'error',
          'Invalid Username or Password',
        );
      });

      it('should fail with non-existent username', async () => {
        const res = await request(app)
          .post('/api/login')
          .send({ username: 'unknown', password: 'password123' });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
          'error',
          'Invalid Username or Password',
        );
      });
    });
})