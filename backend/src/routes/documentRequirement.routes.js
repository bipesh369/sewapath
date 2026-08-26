import { Router } from "express";
import documentRequirementController from "../controllers/documentRequirement.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = Router();

router
  .route("/services/:serviceId/documents")
  .get(documentRequirementController.getDocumentRequirements)
  .post(
    protect,
    authorize("admin"),
    documentRequirementController.createDocumentRequirement
  );

router
  .route("/:id")
  .patch(
    protect,
    authorize("admin"),
    documentRequirementController.updateDocumentRequirement
  )
  .delete(
    protect,
    authorize("admin"),
    documentRequirementController.deleteDocumentRequirement
  );

export default router;