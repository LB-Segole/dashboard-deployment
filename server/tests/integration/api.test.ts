import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';
import { createTestUser, getAuthToken } from '../setup';

describe('API Integration Tests', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    const { user, token } = await createTestUser();
    testUserId = user.id;
    authToken = token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'test@test.com' } } });
  });

  describe('Authentication', () => {
    it('should protect unauthorized routes', async () => {
      const response = await request(app).get('/api/users/profile');
      expect(response.status).toBe(401);
    });

    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
    });
  });

  describe('Agents API', () => {
    it('should create and retrieve agents', async () => {
      const createResponse = await request(app)
        .post('/api/agents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Agent',
          voiceModel: 'MALE_1',
          persona: 'FRIENDLY',
          initialMessage: 'Hello!'
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toHaveProperty('id');

      const getResponse = await request(app)
        .get('/api/agents')
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.length).toBeGreaterThan(0);
    });
  });
});