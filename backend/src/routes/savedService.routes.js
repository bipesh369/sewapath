import { Router } from "express";
import savedServiceController from "../controllers/savedService.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/:serviceId",
  protect,
  savedServiceController.saveService
);

router.get(
  "/",
  protect,
  savedServiceController.getSavedServices
);

router.delete(
  "/:serviceId",
  protect,
  savedServiceController.removeSavedService
);

export default router;