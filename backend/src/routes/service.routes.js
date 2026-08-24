import { Router } from "express";
import serviceController from "../controllers/service.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
const router = Router();


router
  .route("/")
  .get(serviceController.getServices)
  .post(
    protect,
    authorize("admin"),
    serviceController.createService
  );

router
   .route("/:id")
   .get(serviceController.getServiceById)
  

export default router;