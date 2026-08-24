import express from "express";
import documentRequirementController
  from "../controllers/documentRequirement.controller.js";

const router = express.Router();

router.post(
  "/services/:serviceId/documents",
  documentRequirementController.createDocumentRequirement
);

router.get(
  "/services/:serviceId/documents",
  documentRequirementController.getDocumentRequirements
);

export default router;