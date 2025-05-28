/**
 * Test Database Utilities
 * Setup and teardown for test databases
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { DatabaseResult } from '../types/database';

let mongoServer: MongoMemoryServer;

export const setupTestDB = async (): Promise<DatabaseResult<string>> => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    
    return { data: uri, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const teardownTestDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearCollections = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};