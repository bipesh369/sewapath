import express from "express";

import journeyStep from "../controllers/journeyStep.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../utils/validation.js";

import {
  createJourneyStepSchema,
} from "../validations/journey.validation.js";

const router = express.Router();

router.post(
  "/services/:serviceId/journey",
  protect,
  authorize("admin"),
  validate(createJourneyStepSchema),
  journeyStep.createJourneyStep
);

router.get(
  "/services/:serviceId/journey",
  journeyStep.getJourneySteps
);

export default router;