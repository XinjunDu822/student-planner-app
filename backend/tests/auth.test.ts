import request from 'supertest';
import app from '../src/app';

describe('Auth Endpoints', () => {
  it('should return sign-in message', async () => {
    const res = await request(app)
      .post('/auth/sign-in')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('signIn called');
  });

  it('should return sign-up message', async () => {
    const res = await request(app)
      .post('/auth/sign-up')
      .send({ email: 'newuser@example.com', password: 'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('signUp called');
  });
});
