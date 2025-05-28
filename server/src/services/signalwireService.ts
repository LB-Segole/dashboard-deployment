import { RestClient } from '@signalwire/compatibility-api';
import { config } from '../config';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/Logger';
import { redis } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { CallStatus, CallEvent } from '../types/call';
import { retry } from '../utils/retry';

const client = new RestClient(
  config.signalWire.projectId,
  config.signalWire.apiToken,
  { signalwireSpaceUrl: config.signalWire.spaceUrl }
);

// Cache key prefixes
const CALL_STATUS_PREFIX = 'call:status:';
const CALL_RECORDING_PREFIX = 'call:recording:';

export const SignalWireService = {
  async initiateCall(params: {
    to: string;
    from: string;
    agentId: string;
    callId: string;
    customParameters?: Record<string, string>;
  }) {
    try {
      // Validate phone numbers
      if (!this.isValidPhoneNumber(params.to) || !this.isValidPhoneNumber(params.from)) {
        throw new AppError('Invalid phone number format', 400);
      }

      // Check rate limits
      const rateLimitKey = `ratelimit:calls:${params.from}`;
      const callCount = await redis.incr(rateLimitKey);
      if (callCount === 1) {
        await redis.expire(rateLimitKey, 3600); // 1 hour window
      }
      if (callCount > config.signalWire.maxCallsPerHour) {
        throw new AppError('Call rate limit exceeded', 429);
      }

      // Create call with retries
      const call = await retry(
        async () => {
          return await client.calls.create({
            to: params.to,
            from: params.from,
            url: `${config.app.webhookUrl}/signalwire/call-start`,
            statusCallback: `${config.app.webhookUrl}/signalwire/call-status`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
            recording: {
              recordingStatusCallback: `${config.app.webhookUrl}/signalwire/recording-status`,
              recordingStatusCallbackEvent: ['completed'],
            },
            machineDetection: 'Enable',
            parameters: {
              agentId: params.agentId,
              callId: params.callId,
              ...params.customParameters,
            },
          });
        },
        {
          retries: 3,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 5000,
        }
      );

      // Store call details in cache
      await redis.setex(
        `${CALL_STATUS_PREFIX}${call.sid}`,
        3600,
        JSON.stringify({
          callSid: call.sid,
          status: call.status,
          agentId: params.agentId,
          callId: params.callId,
          to: params.to,
          from: params.from,
          startTime: new Date().toISOString(),
        })
      );

      // Log call initiation
      logger.info(`Call initiated: ${call.sid}`, {
        callSid: call.sid,
        to: params.to,
        from: params.from,
        agentId: params.agentId,
      });

      return call;
    } catch (error) {
      logger.error('Failed to initiate call:', error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        'Failed to initiate call: ' + (error as Error).message,
        500
      );
    }
  },

  async endCall(callSid: string) {
    try {
      await retry(
        async () => {
          await client.calls(callSid).update({ status: 'completed' });
        },
        {
          retries: 3,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 5000,
        }
      );

      // Update cache and database
      await redis.del(`${CALL_STATUS_PREFIX}${callSid}`);
      await prisma.call.update({
        where: { signalwireCallSid: callSid },
        data: { status: CallStatus.COMPLETED, endTime: new Date() },
      });

      logger.info(`Call ended: ${callSid}`);
    } catch (error) {
      logger.error('Failed to end call:', error);
      throw new AppError(
        'Failed to end call: ' + (error as Error).message,
        500
      );
    }
  },

  async handleCallWebhook(event: CallEvent) {
    try {
      const { CallSid, CallStatus, RecordingUrl, RecordingDuration } = event;

      // Update call status in cache and database
      const callData = await redis.get(`${CALL_STATUS_PREFIX}${CallSid}`);
      if (callData) {
        const call = JSON.parse(callData);
        call.status = CallStatus;
        await redis.setex(
          `${CALL_STATUS_PREFIX}${CallSid}`,
          3600,
          JSON.stringify(call)
        );
      }

      // Handle different webhook events
      switch (event.EventType) {
        case 'initiated':
          await this.handleCallInitiated(event);
          break;
        case 'ringing':
          await this.handleCallRinging(event);
          break;
        case 'answered':
          await this.handleCallAnswered(event);
          break;
        case 'completed':
          await this.handleCallCompleted(event);
          break;
        case 'recording-completed':
          await this.handleRecordingCompleted(event);
          break;
      }

      logger.info(`Call webhook processed: ${CallSid}`, {
        eventType: event.EventType,
        callStatus: CallStatus,
      });
    } catch (error) {
      logger.error('Failed to handle call webhook:', error);
      throw new AppError(
        'Failed to handle call webhook: ' + (error as Error).message,
        500
      );
    }
  },

  private async handleCallInitiated(event: CallEvent) {
    await prisma.call.create({
      data: {
        signalwireCallSid: event.CallSid,
        status: CallStatus.INITIATED,
        from: event.From,
        to: event.To,
        startTime: new Date(),
      },
    });
  },

  private async handleCallRinging(event: CallEvent) {
    await prisma.call.update({
      where: { signalwireCallSid: event.CallSid },
      data: { status: CallStatus.RINGING },
    });
  },

  private async handleCallAnswered(event: CallEvent) {
    await prisma.call.update({
      where: { signalwireCallSid: event.CallSid },
      data: { status: CallStatus.IN_PROGRESS, answeredAt: new Date() },
    });
  },

  private async handleCallCompleted(event: CallEvent) {
    await prisma.call.update({
      where: { signalwireCallSid: event.CallSid },
      data: {
        status: CallStatus.COMPLETED,
        endTime: new Date(),
        duration: event.CallDuration,
      },
    });
  },

  private async handleRecordingCompleted(event: CallEvent) {
    const recordingData = {
      url: event.RecordingUrl,
      duration: event.RecordingDuration,
      status: 'completed',
    };

    await redis.setex(
      `${CALL_RECORDING_PREFIX}${event.CallSid}`,
      86400, // 24 hours
      JSON.stringify(recordingData)
    );

    await prisma.callRecording.create({
      data: {
        callId: event.CallSid,
        url: event.RecordingUrl,
        duration: event.RecordingDuration,
        status: 'completed',
      },
    });
  },

  private isValidPhoneNumber(phone: string): boolean {
    // Basic E.164 format validation
    return /^\+[1-9]\d{1,14}$/.test(phone);
  },
};