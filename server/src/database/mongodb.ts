import { MongoClient } from 'mongodb'
import { env } from '@/env.mjs'

const uri = env.MONGODB_URI
const dbName = env.MONGODB_DB

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getMongoCollection<T>(collectionName: string) {
  const { db } = await connectToDatabase()
  return db.collection<T>(collectionName)
}

// Collections
export const collections = {
  callLogs: 'call_logs',
  conversationAnalytics: 'conversation_analytics',
  realtimeTranscriptions: 'realtime_transcriptions',
}

// Indexes
export async function createMongoIndexes() {
  const { db } = await connectToDatabase()

  await db.collection(collections.callLogs).createIndex({ callSid: 1 }, { unique: true })
  await db.collection(collections.callLogs).createIndex({ userId: 1 })
  await db.collection(collections.callLogs).createIndex({ createdAt: -1 })

  await db.collection(collections.conversationAnalytics).createIndex({ callId: 1 }, { unique: true })
  await db.collection(collections.conversationAnalytics).createIndex({ sentimentScore: 1 })

  console.log('✅ Created MongoDB indexes')
}

// Close connection
export async function closeMongoConnection() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}