import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const client = new MongoClient(uri);

// 导出 clientPromise 供 MongoDBAdapter 使用
export const clientPromise = client.connect().then(() => client);

let cachedClient: MongoClient | null = null;
let cachedDb: { collection(name: string): any } | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const dbName = "personal-blog";
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}