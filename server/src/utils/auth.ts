import jwt, { SignOptions, DecodeOptions } from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticationError } from '../middleware/error-handler';

interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface JwtSignOptions extends SignOptions {
  expiresIn: number | string; // Allow both numeric (seconds) and string (e.g., '7d') formats
}

const signToken = (
  payload: Omit<TokenPayload, 'iat' | 'exp'>,
  secret: string,
  options: JwtSignOptions
): string => {
  return jwt.sign(payload, secret, options);
};

export const generateToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const options: JwtSignOptions = {
    expiresIn: config.jwt.expiresIn,
  };
  return signToken(payload, config.jwt.secret, options);
};

export const generateRefreshToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const options: JwtSignOptions = {
    expiresIn: config.jwt.refreshExpiresIn,
  };
  return signToken(payload, config.jwt.refreshSecret, options);
};

export const verifyJwtToken = async (token: string): Promise<TokenPayload> => {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    }
    throw error;
  }
};

export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid refresh token');
    }
    throw error;
  }
};

export const extractTokenFromHeader = (header?: string): string => {
  if (!header?.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }
  return header.slice(7);
}; 