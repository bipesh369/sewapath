import express from "express";

import journeyStep from "../controllers/journeyStep.controller.js";

const router = express.Router();

router.post(
  "/services/:serviceId/journey",
  journeyStep.createJourneyStep
);

router.get(
  "/services/:serviceId/journey",
  journeyStep.getJourneySteps
);

export default router;