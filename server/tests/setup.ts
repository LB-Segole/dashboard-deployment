import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import jwt from 'jsonwebtoken';
import { config } from '../../src/config';

export const prismaMock = mockDeep<PrismaClient>();
jest.mock('../../src/lib/prisma', () => ({
  __esModule: true,
  prisma: prismaMock
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const createTestUser = async () => {
  const user = {
    id: 'user123',
    email: 'test@test.com',
    name: 'Test User',
    password: 'hashedpassword',
    createdAt: new Date()
  };

  prismaMock.user.create.mockResolvedValue(user);
  prismaMock.user.findUnique.mockResolvedValue(user);

  const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });

  return { user, token };
};

export const createTestCall = async () => {
  const call = {
    id: 'call123',
    userId: 'user123',
    agentId: 'agent123',
    phoneNumber: '+1234567890',
    status: 'INITIATED',
    direction: 'OUTBOUND',
    externalId: 'sw123',
    createdAt: new Date()
  };

  prismaMock.call.create.mockResolvedValue(call);
  prismaMock.call.findUnique.mockResolvedValue(call);

  return call;
};

export type PrismaMock = DeepMockProxy<PrismaClient>;