import { Router } from "express";

import serviceController from "../controllers/service.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../utils/validation.js";
import serviceSchemas from "../validations/service.validation.js";
const router = Router();

// Service collection
router
  .route("/")
  .get(serviceController.getServices)
  .post(
    protect,
    authorize("admin"),
    validate(serviceSchemas.createServiceSchema),
    serviceController.createService
  );

// Match services
router.post("/match", serviceController.matchServices);

// Single service
router
  .route("/:id")
  .get(serviceController.getServiceById)
  .patch(
    protect,
    authorize("admin"),
    validate(serviceSchemas.updateServiceSchema),
    serviceController.updateService
  )
  .delete(
    protect,
    authorize("admin"),
    serviceController.deleteService
  );

export default router;