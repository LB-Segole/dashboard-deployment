import { RestClient as SignalWireClient } from '@signalwire/compatibility-api';
import { config } from '../config';

let signalwireClient: SignalWireClient | null = null;

export function useSignalWire() {
  const getClient = (): SignalWireClient => {
    if (!signalwireClient) {
      signalwireClient = new SignalWireClient(
        config.signalWire.projectId,
        config.signalWire.apiToken,
        { signalwireSpaceUrl: config.signalWire.spaceUrl }
      );
    }
    return signalwireClient;
  };

  const makeCall = async (params: {
    to: string;
    from?: string;
    url: string;
    statusCallback?: string;
    timeout?: number;
    record?: boolean;
  }) => {
    const client = getClient();
    const defaultFrom = config.signalWire.phoneNumber;

    try {
      const call = await client.calls.create({
        to: params.to,
        from: params.from || defaultFrom,
        url: params.url,
        statusCallback: params.statusCallback,
        timeout: params.timeout || config.signalWire.timeout,
        record: params.record ?? true,
      });
      return call;
    } catch (error) {
      throw new Error(`Failed to make SignalWire call: ${error}`);
    }
  };

  const getCallDetails = async (callSid: string) => {
    const client = getClient();
    try {
      return await client.calls(callSid).fetch();
    } catch (error) {
      throw new Error(`Failed to fetch call details: ${error}`);
    }
  };

  const updateCallStatus = async (callSid: string, status: 'completed' | 'canceled') => {
    const client = getClient();
    try {
      return await client.calls(callSid).update({ status });
    } catch (error) {
      throw new Error(`Failed to update call status: ${error}`);
    }
  };

  const getRecording = async (recordingSid: string) => {
    const client = getClient();
    try {
      return await client.recordings(recordingSid).fetch();
    } catch (error) {
      throw new Error(`Failed to fetch recording: ${error}`);
    }
  };

  return {
    getClient,
    makeCall,
    getCallDetails,
    updateCallStatus,
    getRecording,
  };
} 