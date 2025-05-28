import { prisma } from '../../src/lib/prisma';
import { createTestUser } from '../setup';

describe('Database Tests', () => {
  afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'test@test.com' } } });
  });

  it('should create and retrieve users', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashedpassword'
      }
    });

    const foundUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.email).toBe('test@test.com');
  });

  it('should maintain data integrity', async () => {
    await expect(
      prisma.user.create({
        data: {
          email: 'test@test.com',
          name: 'Test User',
          password: 'hashedpassword'
        }
      })
    ).resolves.toBeDefined();

    await expect(
      prisma.user.create({
        data: {
          email: 'test@test.com',
          name: 'Duplicate',
          password: 'hashedpassword'
        }
      })
    ).rejects.toThrow();
  });
});