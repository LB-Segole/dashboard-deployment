import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

export const VoiceConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  provider: z.enum(['DEEPGRAM', 'SIGNALWIRE', 'CUSTOM']),
  voiceId: z.string(),
  settings: z.object({
    speed: z.number().min(0.5).max(2.0),
    pitch: z.number().min(-20).max(20).optional(),
    volume: z.number().min(0).max(100).optional(),
    stability: z.number().min(0).max(1).optional(),
    similarity: z.number().min(0).max(1).optional(),
  }),
  personality: z.object({
    tone: z.enum(['PROFESSIONAL', 'FRIENDLY', 'CASUAL', 'FORMAL']),
    style: z.enum(['CONCISE', 'DETAILED', 'CONVERSATIONAL', 'DIRECT']),
    language: z.string(),
    basePrompt: z.string(),
    customInstructions: z.string().optional(),
    fallbackResponses: z.array(z.string()),
  }),
  audioProcessing: z.object({
    noiseReduction: z.boolean(),
    normalization: z.boolean(),
    silenceThreshold: z.number().min(0).max(1),
    silencePadding: z.number().min(0),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type VoiceConfig = z.infer<typeof VoiceConfigSchema>;

export const VoiceConfigService = {
  async create(data: Omit<VoiceConfig, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.voiceConfig.create({
      data,
    });
  },

  async update(id: string, data: Partial<VoiceConfig>) {
    return prisma.voiceConfig.update({
      where: { id },
      data,
    });
  },

  async getById(id: string) {
    return prisma.voiceConfig.findUnique({
      where: { id },
    });
  },

  async list() {
    return prisma.voiceConfig.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  async delete(id: string) {
    return prisma.voiceConfig.delete({
      where: { id },
    });
  },

  generatePrompt(config: VoiceConfig, context: Record<string, any> = {}): string {
    const { personality } = config;
    let prompt = personality.basePrompt;

    // Add tone and style instructions
    prompt += `\nPlease respond in a ${personality.tone.toLowerCase()}, ${personality.style.toLowerCase()} manner.`;

    // Add custom instructions if available
    if (personality.customInstructions) {
      prompt += `\n${personality.customInstructions}`;
    }

    // Replace any context variables in the prompt
    Object.entries(context).forEach(([key, value]) => {
      prompt = prompt.replace(`{${key}}`, value.toString());
    });

    return prompt;
  },
}; 