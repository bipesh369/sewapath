import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    const connection = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      `[db] MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(`[db] connection error: ${error.message}`);

    process.exit(1);
  }
};

export default connectDB;