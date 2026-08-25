import express from "express";
import cors from "cors";
import serviceRoutes from "./routes/service.routes.js"
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js"
import documentRequirementRoutes from "./routes/documentRequirement.routes.js"
import eligibilityQuestionRoutes from "./routes/eligibilityQuestion.routes.js"
import journeyStepRoutes from "./routes/journeyStep.routes.js"


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
app.use("/api/auth", authRoutes);

// Global error handler
app.use(errorHandler)

app.use("/api", documentRequirementRoutes)

app.use("/api", eligibilityQuestionRoutes)

app.use("/api", journeyStepRoutes);



export default app;