import express from "express";

import eligibilityQuestion from "../controllers/eligibilityQuestion.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../utils/validation.js";

import eligibilitySchemas from "../validations/eligibility.validation.js";

const router = express.Router();

// Create eligibility question
router.post(
  "/services/:serviceId/eligibility",
  protect,
  authorize("admin"),
  validate(eligibilitySchemas.createEligibilityQuestionSchema),
  eligibilityQuestion.createEligibilityQuestion
);

// Get eligibility questions
router.get(
  "/services/:serviceId/eligibility",
  eligibilityQuestion.getEligibilityQuestions
);

// Evaluate eligibility
router.post(
  "/services/:serviceId/eligibility/evaluate",
  validate(eligibilitySchemas.evaluateEligibilitySchema),
  eligibilityQuestion.evaluateEligibility
);

export default router;