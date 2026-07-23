const request = require('supertest');
const path = require('path');

// Mock the AI bridge so tests don't depend on Ollama running, and run fast.
jest.mock('../src/application/analyzeFailures', () => ({
  analyzeFailures: jest.fn(async (failures, onBatchComplete) => {
    const fakeResults = failures.map((f) => ({
      id: f.id,
      category: 'UNKNOWN',
      severity: 'LOW',
      cleanSummary: 'Mocked analysis for testing.',
    }));
    if (onBatchComplete) {
      await onBatchComplete(fakeResults);
    }
    return fakeResults;
  }),
}));

const app = require('../src/app');
const prisma = require('../src/infrastructure/prismaClient');

describe('Upload integration flow', () => {
  let token;
  const testEmail = `test-${Date.now()}@thoughtflow.dev`;

  beforeAll(async () => {
    // Register a fresh test user and log in to get a real token
    await request(app).post('/api/register').send({
      email: testEmail,
      password: 'TestPass123!',
      role: 'QA_LEAD',
    });

    const loginRes = await request(app).post('/api/login').send({
      email: testEmail,
      password: 'TestPass123!',
    });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('uploads a file, parses it, and saves failures to the database', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'tiny-test-file.xlsx');

    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', filePath);

    expect(res.status).toBe(201);
    expect(res.body.rowCount).toBe(2);
    expect(res.body.failures).toHaveLength(2);
    expect(res.body.failures[0].category).toBe('UNKNOWN');

    // Verify the data actually landed in the real database
    const savedFailures = await prisma.parsedFailure.findMany({
      where: { sourceFileId: res.body.uploadedFileId },
    });
    expect(savedFailures).toHaveLength(2);
    expect(savedFailures[0].cleanSummary).toBe('Mocked analysis for testing.');
  });

  test('rejects upload without a valid token', async () => {
    const res = await request(app).post('/api/upload');

    expect(res.status).toBe(401);
  });
});