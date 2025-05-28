/**
 * Test Data Factory for VoiceAI
 * Centralized test data generation for consistent testing
 */

import { faker } from '@faker-js/faker';
import { CallDirection, CallStatus } from '../types/calls';
import { AgentStatus, AgentLanguage } from '../types/agents';

export const generateUser = (overrides = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  role: 'user',
  avatar: faker.image.avatar(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const generateCall = (overrides = {}) => ({
  id: faker.string.uuid(),
  sessionId: faker.string.uuid(),
  direction: faker.helpers.arrayElement(Object.values(CallDirection)),
  status: faker.helpers.arrayElement(Object.values(CallStatus)),
  participants: [
    {
      phoneNumber: faker.phone.number(),
      name: faker.person.fullName(),
      role: 'caller',
    },
  ],
  startTime: faker.date.recent(),
  endTime: faker.date.soon(),
  duration: faker.number.int({ min: 30, max: 600 }),
  recordingUrl: faker.internet.url(),
  transcriptId: faker.string.uuid(),
  ...overrides,
});

export const generateAgent = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName() + ' Agent',
  description: faker.lorem.sentence(),
  status: faker.helpers.arrayElement(Object.values(AgentStatus)),
  language: faker.helpers.arrayElement(Object.values(AgentLanguage)),
  voiceModel: 'voice-model-1',
  llmModel: 'gpt-4',
  sttModel: 'whisper',
  ttsModel: 'deepgram',
  temperature: faker.number.float({ min: 0, max: 1, precision: 0.1 }),
  prompt: faker.lorem.paragraph(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const generateTranscript = (overrides = {}) => ({
  id: faker.string.uuid(),
  callId: faker.string.uuid(),
  rawText: faker.lorem.paragraphs(2),
  processedText: faker.lorem.paragraphs(2),
  speakerCount: faker.number.int({ min: 1, max: 3 }),
  speakers: Array.from({ length: 2 }, (_, i) => ({
    id: i + 1,
    label: `Speaker ${i + 1}`,
    duration: faker.number.int({ min: 30, max: 300 }),
    wordCount: faker.number.int({ min: 50, max: 500 }),
  })),
  wordTimings: Array.from({ length: 20 }, (_, i) => ({
    word: faker.lorem.word(),
    start: faker.number.float({ min: 0, max: 60 }),
    end: faker.number.float({ min: 0, max: 60 }),
    speaker: faker.number.int({ min: 1, max: 2 }),
    confidence: faker.number.float({ min: 0.7, max: 1 }),
  })),
  ...overrides,
});