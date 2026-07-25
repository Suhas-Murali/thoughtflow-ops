const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/infrastructure/prismaClient');

describe('Auth endpoints', () => {
  const testEmail = `auth-test-${Date.now()}@thoughtflow.dev`;
  const testPassword = 'ValidPass123';

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('registers a new user successfully', async () => {
    const res = await request(app).post('/api/register').send({
      email: testEmail,
      password: testPassword,
      role: 'QA_LEAD',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.password).toBeUndefined(); // password hash must never be returned
  });

  test('rejects duplicate registration with the same email', async () => {
    const res = await request(app).post('/api/register').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(400);
  });

  test('rejects registration with invalid email format', async () => {
    const res = await request(app).post('/api/register').send({
      email: 'not-an-email',
      password: testPassword,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed.');
  });

  test('logs in successfully with correct credentials', async () => {
    const res = await request(app).post('/api/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('rejects login with wrong password', async () => {
    const res = await request(app).post('/api/login').send({
      email: testEmail,
      password: 'WrongPassword123',
    });

    expect(res.status).toBe(401);
  });

  test('rejects login for a non-existent email', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'nobody-real@thoughtflow.dev',
      password: testPassword,
    });

    expect(res.status).toBe(401);
  });
});