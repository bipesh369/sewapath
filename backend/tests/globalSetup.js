import dotenv from "dotenv";
import mongoose from "mongoose";

export async function setup() {
  dotenv.config();

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("[test] MongoDB connected");
}

export async function teardown() {
  await mongoose.disconnect();

  console.log("[test] MongoDB disconnected");
}