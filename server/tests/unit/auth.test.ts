import { AuthService } from '../../src/services/auth-service';
import { prismaMock } from '../setup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../src/errors/AppError';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service Unit Tests', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@test.com',
    password: 'hashedpassword',
    name: 'Test User',
    createdAt: new Date()
  };

  beforeEach(() => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocktoken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await AuthService.register(
        'test@test.com',
        'password123',
        'Test User'
      );

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error for duplicate email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        AuthService.register('test@test.com', 'password123', 'Test User')
      ).rejects.toThrow(AppError);
    });
  });
});