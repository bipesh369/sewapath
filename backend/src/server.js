import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import serviceRouters from "./routes/service.routes.js"

dotenv.config({
  PAATH: "../.env",
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.use("/api/services", serviceRouters)

    app.listen(PORT, () => {
      console.log(`[server] SewaPath running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`[server] startup failed: ${error.message}`);

    process.exit(1);
  }
};

startServer();

