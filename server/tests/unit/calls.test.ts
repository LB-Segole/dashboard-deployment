import { CallService } from '../../src/services/call-service';
import { prismaMock } from '../setup';
import { SignalWireService } from '../../src/services/signalwire-service';
import { AppError } from '../../src/errors/AppError';

jest.mock('../../src/services/signalwire-service');

describe('Call Service Unit Tests', () => {
  const testUserId = 'user123';
  const testAgentId = 'agent123';
  const testCallId = 'call123';

  beforeEach(() => {
    jest.spyOn(SignalWireService, 'initiateCall').mockResolvedValue({
      id: 'sw123',
      status: 'queued'
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initiateCall', () => {
    it('should create a new call', async () => {
      prismaMock.agent.findUnique.mockResolvedValue({
        id: testAgentId,
        userId: testUserId,
        name: 'Test Agent'
      });
      prismaMock.call.create.mockResolvedValue({
        id: testCallId,
        userId: testUserId,
        agentId: testAgentId,
        phoneNumber: '+1234567890',
        status: 'INITIATED',
        direction: 'OUTBOUND',
        externalId: 'sw123',
        createdAt: new Date()
      });

      const call = await CallService.initiateCall(
        testUserId,
        testAgentId,
        '+1234567890'
      );

      expect(call).toHaveProperty('id');
      expect(SignalWireService.initiateCall).toHaveBeenCalled();
    });
  });
});