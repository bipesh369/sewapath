import express from "express";
import cors from "cors";
import helmet from "helmet";

import serviceRoutes from "./routes/service.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import documentRequirementRoutes from "./routes/documentRequirement.routes.js";
import eligibilityQuestionRoutes from "./routes/eligibilityQuestion.routes.js";
import journeyStepRoutes from "./routes/journeyStep.routes.js";
import officeRoutes from "./routes/office.routes.js";
import savedServiceRoutes from "./routes/savedService.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SewaPath API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api", documentRequirementRoutes);
app.use("/api", eligibilityQuestionRoutes);
app.use("/api", journeyStepRoutes);
app.use("/api/offices", officeRoutes);
app.use("/api/saved-services", savedServiceRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// Error handler must be last
app.use(errorHandler);

export default app;