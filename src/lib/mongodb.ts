import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

const globalForMongo = globalThis as typeof globalThis & { __infycrestMongoClient?: MongoClient };
export const mongoClient = globalForMongo.__infycrestMongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo.__infycrestMongoClient = mongoClient;

export const mongoDb = mongoClient.db(process.env.MONGODB_DB ?? "infycrest");
