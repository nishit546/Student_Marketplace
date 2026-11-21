import mongoose from "mongoose";
import dns from "dns";

// Ensure SRV records can be resolved in local environments where ISP DNS blocks them
if (
  process.env.NODE_ENV !== "production" &&
  !process.env.VERCEL &&
  typeof dns.setServers === "function"
) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
    // Ignore if not supported in runtime
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Connects to MongoDB with connection caching for Next.js hot-reloading.
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB with connection caching for Next.js hot-reloading.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI || MONGODB_URI === "your_mongodb_connection_string") {
    throw new Error(
      "Please define a valid MONGODB_URI in your .env.local file."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      dbName: "campuskart",
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
