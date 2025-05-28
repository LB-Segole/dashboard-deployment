import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';
import { createTestCall } from '../setup';

describe('Webhook Integration Tests', () => {
  let testCallId: string;

  beforeAll(async () => {
    const call = await createTestCall();
    testCallId = call.id;
  });

  afterAll(async () => {
    await prisma.call.deleteMany({ where: { id: testCallId } });
  });

  it('should handle call events', async () => {
    const eventPayload = {
      CallSid: 'test123',
      CallStatus: 'in-progress',
      callId: testCallId
    };

    const response = await request(app)
      .post('/api/webhooks/call-events')
      .send(eventPayload);

    expect(response.status).toBe(200);

    const updatedCall = await prisma.call.findUnique({
      where: { id: testCallId }
    });

    expect(updatedCall?.status).toBe('IN_PROGRESS');
  });
});