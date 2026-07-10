import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI or MONGODB_URL environment variable inside your env file"
  );
}

// Define the interface for our cached connection structure
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Safely extend globalThis to store the cache in a typed manner (avoiding 'any')
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Ensure the global cache object is initialized
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = { conn: null, promise: null };
}

// Reference the initialized global cache using a const reference for strict typing
const cached = globalThis.mongooseCache;

/**
 * Connects to MongoDB and returns the mongoose instance.
 * Caches the connection to prevent connection exhaustion in Next.js development.
 */
async function dbConnect(): Promise<mongoose.Mongoose> {
  // If a connection is already established, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is not already in flight, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise and save the connection instance
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, reset the promise cache so subsequent calls can retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
