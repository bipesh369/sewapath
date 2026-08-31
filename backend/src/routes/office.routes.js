import express from "express";

import officeController from "../controllers/office.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = express.Router();

router.get("/", officeController.getOffices);

router.get("/:id", officeController.getOfficeById);

router.post(
  "/",
  protect,
  authorize("admin"),
  officeController.createOffice
);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  officeController.updateOffice
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  officeController.deleteOffice
);

export default router;