import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  protect,
  notificationController.getNotifications
);

router.patch(
  "/:id/read",
  protect,
  notificationController.markNotificationAsRead
);

export default router;