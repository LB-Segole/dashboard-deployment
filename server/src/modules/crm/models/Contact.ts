import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

export const ContactSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string(),
  company: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  lastContactedAt: z.date().optional(),
  nextScheduledCall: z.date().optional(),
  callHistory: z.array(z.object({
    id: z.string().uuid(),
    timestamp: z.date(),
    duration: z.number(),
    type: z.enum(['INBOUND', 'OUTBOUND']),
    recordingUrl: z.string().optional(),
    transcription: z.string().optional(),
    sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']).optional(),
    notes: z.string().optional(),
  })),
  customFields: z.record(z.string(), z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Contact = z.infer<typeof ContactSchema>;

export const ContactService = {
  async create(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.contact.create({
      data: {
        ...data,
        callHistory: [],
      },
    });
  },

  async update(id: string, data: Partial<Contact>) {
    return prisma.contact.update({
      where: { id },
      data,
    });
  },

  async addCallRecord(contactId: string, callData: Contact['callHistory'][0]) {
    return prisma.contact.update({
      where: { id: contactId },
      data: {
        callHistory: {
          push: callData,
        },
        lastContactedAt: new Date(),
      },
    });
  },

  async scheduleCall(contactId: string, scheduledDate: Date) {
    return prisma.contact.update({
      where: { id: contactId },
      data: {
        nextScheduledCall: scheduledDate,
      },
    });
  },
}; 