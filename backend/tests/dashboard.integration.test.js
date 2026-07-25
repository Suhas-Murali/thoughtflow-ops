const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/infrastructure/prismaClient');

describe('Dashboard read endpoints', () => {
  let token;
  const testEmail = `dashboard-test-${Date.now()}@thoughtflow.dev`;

  beforeAll(async () => {
    await request(app).post('/api/register').send({
      email: testEmail,
      password: 'ValidPass123',
      role: 'QA_LEAD',
    });
    const loginRes = await request(app).post('/api/login').send({
      email: testEmail,
      password: 'ValidPass123',
    });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('returns dashboard stats with expected shape', async () => {
    const res = await request(app).get('/api/stats').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.totalFailures).toBe('number');
    expect(Array.isArray(res.body.byCategory)).toBe(true);
    expect(Array.isArray(res.body.bySeverity)).toBe(true);
  });

  test('rejects stats request without a token', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(401);
  });

  test('returns a list of failures', async () => {
    const res = await request(app).get('/api/failures').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.failures)).toBe(true);
  });

  test('filters failures by category', async () => {
    const res = await request(app)
      .get('/api/failures?category=NETWORK_ERROR')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // Every returned row should actually match the filter
    res.body.failures.forEach((f) => {
      expect(f.category).toBe('NETWORK_ERROR');
    });
  });
});