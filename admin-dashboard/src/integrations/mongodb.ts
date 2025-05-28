import { MongoClient, Db } from 'mongodb';

let cachedDb: Db | null = null;

export const connectToDatabase = async (): Promise<Db> => {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable not set');
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_NAME || 'voiceai');

  cachedDb = db;
  return db;
};

export const getCollection = async <T>(collectionName: string) => {
  const db = await connectToDatabase();
  return db.collection<T>(collectionName);
};