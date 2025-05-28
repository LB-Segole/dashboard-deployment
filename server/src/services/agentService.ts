import { prisma } from '../lib/prisma';
import { CreateAgentSchema, UpdateAgentSchema } from '../schemas/agent';
import { AppError } from '../errors/AppError';
import { VoiceModel, AgentPersona } from '@prisma/client';

export const AgentService = {
  async createAgent(userId: string, data: CreateAgentSchema) {
    const agent = await prisma.agent.create({
      data: {
        ...data,
        userId,
        voiceSettings: data.voiceSettings || {},
        initialMessage: data.initialMessage || 'Hello, how can I help you today?'
      }
    });

    return agent;
  },

  async getAgents(userId: string) {
    return prisma.agent.findMany({
      where: { userId },
      include: { calls: { select: { id: true } } }
    });
  },

  async getAgent(userId: string, id: string) {
    const agent = await prisma.agent.findUnique({
      where: { id, userId },
      include: { calls: { orderBy: { createdAt: 'desc' } } }
    });

    if (!agent) throw new AppError('Agent not found', 404);
    return agent;
  },

  async updateAgent(userId: string, id: string, data: UpdateAgentSchema) {
    const agent = await prisma.agent.update({
      where: { id, userId },
      data
    });

    if (!agent) throw new AppError('Agent not found', 404);
    return agent;
  },

  async deleteAgent(userId: string, id: string) {
    await prisma.agent.delete({ where: { id, userId } });
  },

  async testAgent(id: string, input: string) {
    // Implementation would integrate with SignalWire and OpenAI services
    return { response: "Test response", latency: 250 };
  }
};