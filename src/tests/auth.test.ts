import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';

// Test data
const testUser = {
  email: 'test@cardealership.com',
  password: 'SecurePass123!',
};

beforeAll(async () => {
  // Clean up any existing test data
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Clean up test data and disconnect
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  it('should register a new user and return 201 with a JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should reject duplicate email with 409 Conflict', async () => {
    // First registration should succeed (or already happened above)
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Second registration with the same email should fail
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject missing email or password with 400 Bad Request', async () => {
    const resNoEmail = await request(app)
      .post('/api/auth/register')
      .send({ password: 'SomePass123!' });

    expect(resNoEmail.status).toBe(400);
    expect(resNoEmail.body).toHaveProperty('error');

    const resNoPassword = await request(app)
      .post('/api/auth/register')
      .send({ email: 'missing@password.com' });

    expect(resNoPassword.status).toBe(400);
    expect(resNoPassword.body).toHaveProperty('error');
  });
});

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    // Ensure a user exists for login tests by registering one
    // (In the Red phase this will fail, but the test structure is correct)
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
  });

  it('should login with valid credentials and return 200 with a JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should reject invalid password with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject non-existent email with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@cardealership.com', password: 'SomePass123!' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
