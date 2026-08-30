import dotenv from "dotenv";
import mongoose from "mongoose";
import { beforeAll, afterAll } from "vitest";

dotenv.config();

beforeAll(async () => {
  console.log("[test] MONGODB_URI:", process.env.MONGODB_URI);

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("[test] MongoDB connected");
});

afterAll(async () => {
  await mongoose.disconnect();

  console.log("[test] MongoDB disconnected");
});