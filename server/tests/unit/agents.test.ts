import { AgentService } from '../../src/services/agent-service';
import { prismaMock } from '../setup';
import { AppError } from '../../src/errors/AppError';

describe('Agent Service Unit Tests', () => {
  const testUserId = 'user123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAgent', () => {
    it('should create a new agent', async () => {
      const agentData = {
        name: 'Test Agent',
        voiceModel: 'MALE_1',
        persona: 'FRIENDLY',
        initialMessage: 'Hello!'
      };

      prismaMock.agent.create.mockResolvedValue({
        id: 'agent123',
        userId: testUserId,
        ...agentData,
        voiceSettings: {},
        createdAt: new Date()
      });

      const agent = await AgentService.createAgent(testUserId, agentData);
      expect(agent).toHaveProperty('id');
      expect(agent.userId).toBe(testUserId);
    });
  });

  describe('getAgent', () => {
    it('should throw error for non-existent agent', async () => {
      prismaMock.agent.findUnique.mockResolvedValue(null);

      await expect(AgentService.getAgent(testUserId, 'nonexistent'))
        .rejects
        .toThrow(AppError);
    });
  });
});