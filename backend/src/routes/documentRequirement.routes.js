import { Router } from "express";

import documentRequirementController from "../controllers/documentRequirement.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../utils/validation.js";

import documentRequirementSchemas from "../validations/documentRequirement.validation.js";

const router = Router();

// Get and create document requirements for a service
router
  .route("/services/:serviceId/documents")
  .get(documentRequirementController.getDocumentRequirements)
  .post(
    protect,
    authorize("admin"),
    validate(
      documentRequirementSchemas.createDocumentRequirementSchema
    ),
    documentRequirementController.createDocumentRequirement
  );

// Update and delete a document requirement
router.patch(
  "/documents/:id",
  protect,
  authorize("admin"),
  validate(
    documentRequirementSchemas.updateDocumentRequirementSchema
  ),
  documentRequirementController.updateDocumentRequirement
);

router.delete(
  "/documents/:id",
  protect,
  authorize("admin"),
  documentRequirementController.deleteDocumentRequirement
);

export default router;