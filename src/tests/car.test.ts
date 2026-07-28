import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';

// We'll register a user and get a token for protected route tests
let authToken: string;

const testUser = {
  email: 'cartest@dealership.com',
  password: 'TestPass123!',
};

const testCar = {
  make: 'Toyota',
  model: 'Camry',
  year: 2024,
  price: 28999.99,
  mileage: 15000,
  status: 'available',
};

beforeAll(async () => {
  // Clean up
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  // Register a user and grab the JWT token
  const res = await request(app)
    .post('/api/auth/register')
    .send(testUser);

  authToken = res.body.token;
});

afterAll(async () => {
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

// ─── GET /api/cars ──────────────────────────────────────────────

describe('GET /api/cars', () => {
  it('should return a list of cars with status 200', async () => {
    const res = await request(app).get('/api/cars');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─── GET /api/cars/:id ──────────────────────────────────────────

describe('GET /api/cars/:id', () => {
  it('should return a single car with status 200', async () => {
    // Create a car directly in the DB for lookup
    const car = await prisma.car.create({ data: testCar });

    const res = await request(app).get(`/api/cars/${car.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', car.id);
    expect(res.body).toHaveProperty('make', 'Toyota');
  });

  it('should return 404 for a non-existent car', async () => {
    const res = await request(app).get('/api/cars/99999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── POST /api/cars (protected) ─────────────────────────────────

describe('POST /api/cars', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request(app)
      .post('/api/cars')
      .send(testCar);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should create a car and return 201 when authenticated', async () => {
    const res = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testCar);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('make', 'Toyota');
  });
});

// ─── PUT /api/cars/:id (protected) ──────────────────────────────

describe('PUT /api/cars/:id', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request(app)
      .put('/api/cars/1')
      .send({ price: 25999.99 });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should update a car and return 200 when authenticated', async () => {
    const car = await prisma.car.create({ data: testCar });

    const res = await request(app)
      .put(`/api/cars/${car.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ price: 25999.99 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('price', 25999.99);
  });
});

// ─── DELETE /api/cars/:id (protected) ───────────────────────────

describe('DELETE /api/cars/:id', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request(app).delete('/api/cars/1');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should delete a car and return 204 when authenticated', async () => {
    const car = await prisma.car.create({ data: testCar });

    const res = await request(app)
      .delete(`/api/cars/${car.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(204);
  });
});
