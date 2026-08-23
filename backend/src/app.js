import express from "express";
import cors from "cors";
import serviceRoutes from "./routes/service.routes.js"
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URI,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SewaPath API is running",
  });
});

app.use("/api/services", serviceRoutes)

// Global error handler
app.use(errorHandler)

export default app;