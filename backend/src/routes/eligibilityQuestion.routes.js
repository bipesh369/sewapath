import express from "express";

import eligibilityQuestion from "../controllers/eligibilityQuestion.controller.js"

const router = express.Router();

router.post(
  "/services/:serviceId/eligibility",
  eligibilityQuestion.createEligibilityQuestion
);

router.get(
  "/services/:serviceId/eligibility",
  eligibilityQuestion.getEligibilityQuestions
);

export default router;