import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { SignalWireService } from './signalwire-service';
import { CallStatus, CallDirection } from '@prisma/client';

export const CallService = {
  async initiateCall(userId: string, agentId: string, phoneNumber: string) {
    const agent = await prisma.agent.findUnique({ where: { id: agentId, userId } });
    if (!agent) throw new AppError('Agent not found', 404);

    const call = await prisma.call.create({
      data: {
        userId,
        agentId,
        phoneNumber,
        direction: CallDirection.OUTBOUND,
        status: CallStatus.INITIATED
      }
    });

    try {
      const signalwireCall = await SignalWireService.initiateCall({
        to: phoneNumber,
        from: config.signalWire.phoneNumber,
        agentId: agent.id,
        callId: call.id
      });

      await prisma.call.update({
        where: { id: call.id },
        data: { externalId: signalwireCall.id, status: CallStatus.RINGING }
      });

      return call;
    } catch (error) {
      await prisma.call.update({
        where: { id: call.id },
        data: { status: CallStatus.FAILED }
      });
      throw error;
    }
  },

  async endCall(callId: string, userId: string) {
    const call = await prisma.call.findUnique({ where: { id: callId, userId } });
    if (!call) throw new AppError('Call not found', 404);

    await SignalWireService.endCall(call.externalId);
    await prisma.call.update({
      where: { id: callId },
      data: { status: CallStatus.COMPLETED, endedAt: new Date() }
    });

    return call;
  },

  async getCalls(userId: string, limit = 20, offset = 0) {
    return prisma.call.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: { agent: { select: { name: true } } }
    });
  },

  async handleCallEvent(event: any) {
    // Implementation for webhook event handling
  }
};