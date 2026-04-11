import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env.local");
}

// Global type declaration
declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

// Use existing cache or create new
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  // 1️⃣ If connection already exists → reuse
  if (cached.conn) return cached.conn;

  // 2️⃣ If no promise → create new connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.DB_NAME || "myDatabase",
      bufferCommands: false,
    });
  }

  try {
    // 3️⃣ Wait for connection
    cached.conn = await cached.promise;

    // Optional log (dev only)
    if (process.env.NODE_ENV === "development") {
      console.log("✅ MongoDB Connected");
    }
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;