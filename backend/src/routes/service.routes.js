import { Router } from "express";

import serviceController from "../controllers/service.controller.js";

import protect from "../middleware/auth.middleware.js";

import authorize from "../middleware/authorize.middleware.js";

const router = Router();

// Service collection
router
  .route("/")
  .get(serviceController.getServices)
  .post(
    protect,
    authorize("admin"),
    serviceController.createService
  );

// Single service
router
  .route("/:id")
  .get(serviceController.getServiceById)
  .patch(
    protect,
    authorize("admin"),
    serviceController.updateService
  )
  .delete(
    protect,
    authorize("admin"),
    serviceController.deleteService
  );

export default router;