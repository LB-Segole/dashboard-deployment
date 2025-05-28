import { SignalWireService } from '../../src/services/signalwire-service';
import { AppError } from '../../src/errors/AppError';

jest.mock('@signalwire/compatibility-api');

describe('SignalWire Service Unit Tests', () => {
  const testCallParams = {
    to: '+1234567890',
    from: '+1987654321',
    agentId: 'agent123',
    callId: 'call123'
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initiateCall', () => {
    it('should initiate a call', async () => {
      const mockCall = { id: 'sw123', status: 'queued' };
      require('@signalwire/compatibility-api').RestClient.prototype.calls.create.mockResolvedValue(mockCall);

      const result = await SignalWireService.initiateCall(testCallParams);
      expect(result).toEqual(mockCall);
    });

    it('should throw error on failure', async () => {
      require('@signalwire/compatibility-api').RestClient.prototype.calls.create.mockRejectedValue(new Error('API error'));

      await expect(SignalWireService.initiateCall(testCallParams))
        .rejects
        .toThrow(AppError);
    });
  });
});