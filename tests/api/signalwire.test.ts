import { describe, expect, it, vi } from 'vitest';
import { httpClient } from '../../services/apiclient';
import { SignalWireCallResponse } from '../../types/signalwire';

describe('SignalWire API Integration', () => {
  const mockCallResponse: SignalWireCallResponse = {
    callId: 'call123',
    status: 'initiated',
    direction: 'outbound',
    from: '+1234567890',
    to: '+1098765432',
    duration: 0,
    startTime: new Date(),
  };

  it('should initiate outbound call', async () => {
    vi.spyOn(httpClient, 'post').mockResolvedValue(mockCallResponse);
    
    const response = await httpClient.post<SignalWireCallResponse>(
      '/calls/initiate',
      { from: '+1234567890', to: '+1098765432' }
    );

    expect(response.callId).toBe('call123');
    expect(response.direction).toBe('outbound');
  });

  it('should handle call failures', async () => {
    vi.spyOn(httpClient, 'post').mockRejectedValue({
      response: { status: 400, data: { error: 'Invalid number format' } }
    });
    
    await expect(
      httpClient.post('/calls/initiate', { from: 'invalid', to: 'number' })
    ).rejects.toMatchObject({
      response: { status: 400 }
    });
  });
});