import axios from 'axios';

const SIGNALWIRE_API_URL = `https://${process.env.SIGNALWIRE_SPACE}.signalwire.com/api/v1`;

interface CallParams {
  from: string;
  to: string;
  agentId: string;
  context?: string;
}

export const initiateCall = async (params: CallParams) => {
  try {
    const response = await axios.post(
      `${SIGNALWIRE_API_URL}/calls`,
      {
        from: params.from,
        to: params.to,
        url: `${process.env.APP_URL}/api/call-handler?agentId=${params.agentId}`,
        context: params.context || 'voiceai-outbound'
      },
      {
        auth: {
          username: process.env.SIGNALWIRE_PROJECT_ID!,
          password: process.env.SIGNALWIRE_TOKEN!
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('SignalWire call error:', error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Failed to initiate call'
        : 'SignalWire connection error'
    );
  }
};