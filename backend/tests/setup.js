import dotenv from "dotenv";
import mongoose from "mongoose";
import { beforeAll, afterAll } from "vitest";

dotenv.config();

beforeAll(async () => {
  if (!process.env.MONGODB_TEST_URI) {
    throw new Error("MONGODB_TEST_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_TEST_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("[test] Test MongoDB connected");
});

afterAll(async () => {
  await mongoose.disconnect();

  console.log("[test] MongoDB disconnected");
});