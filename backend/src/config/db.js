import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `[db] MongoDB connected: ${connection.connection.port}`
    );
  } catch (error) {
    console.error(`[db] connection error: ${error.message}`);

    process.exit(1);
  }
};

export default connectDB;


