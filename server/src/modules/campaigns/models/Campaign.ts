import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

export const CampaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']),
  type: z.enum(['OUTBOUND', 'INBOUND']),
  schedule: z.object({
    startDate: z.date(),
    endDate: z.date().optional(),
    timeWindows: z.array(z.object({
      dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
      startTime: z.string(), // HH:mm format
      endTime: z.string(), // HH:mm format
      timezone: z.string(),
    })),
    maxConcurrentCalls: z.number().int().positive(),
    callsPerDay: z.number().int().positive().optional(),
  }),
  aiConfig: z.object({
    voiceId: z.string(),
    personality: z.object({
      tone: z.enum(['PROFESSIONAL', 'FRIENDLY', 'CASUAL', 'FORMAL']),
      speed: z.number().min(0.5).max(2.0),
      customInstructions: z.string().optional(),
    }),
    fallbackToHuman: z.boolean(),
    transferTriggers: z.array(z.string()).optional(),
  }),
  contacts: z.array(z.object({
    contactId: z.string().uuid(),
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'SCHEDULED']),
    attempts: z.number().int(),
    lastAttempt: z.date().optional(),
    nextAttempt: z.date().optional(),
  })),
  metrics: z.object({
    totalCalls: z.number().int(),
    successfulCalls: z.number().int(),
    failedCalls: z.number().int(),
    averageCallDuration: z.number(),
    transferRate: z.number(),
    costToDate: z.number(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const CampaignService = {
  async create(data: Omit<Campaign, 'id' | 'metrics' | 'createdAt' | 'updatedAt'>) {
    return prisma.campaign.create({
      data: {
        ...data,
        metrics: {
          totalCalls: 0,
          successfulCalls: 0,
          failedCalls: 0,
          averageCallDuration: 0,
          transferRate: 0,
          costToDate: 0,
        },
      },
    });
  },

  async update(id: string, data: Partial<Campaign>) {
    return prisma.campaign.update({
      where: { id },
      data,
    });
  },

  async updateMetrics(id: string, metrics: Partial<Campaign['metrics']>) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { metrics: true },
    });

    return prisma.campaign.update({
      where: { id },
      data: {
        metrics: {
          ...campaign?.metrics,
          ...metrics,
        },
      },
    });
  },

  async addContact(campaignId: string, contactId: string) {
    return prisma.campaign.update({
      where: { id: campaignId },
      data: {
        contacts: {
          push: {
            contactId,
            status: 'PENDING',
            attempts: 0,
          },
        },
      },
    });
  },

  async updateContactStatus(
    campaignId: string,
    contactId: string,
    status: Campaign['contacts'][0]['status'],
    attempt?: {
      timestamp: Date;
      nextAttempt?: Date;
    }
  ) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { contacts: true },
    });

    const updatedContacts = campaign?.contacts.map(contact => {
      if (contact.contactId === contactId) {
        return {
          ...contact,
          status,
          attempts: contact.attempts + 1,
          lastAttempt: attempt?.timestamp,
          nextAttempt: attempt?.nextAttempt,
        };
      }
      return contact;
    });

    return prisma.campaign.update({
      where: { id: campaignId },
      data: {
        contacts: updatedContacts,
      },
    });
  },
}; 