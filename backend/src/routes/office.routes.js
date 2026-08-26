import express from "express";
import officeController from "../controllers/office.controller.js";

const router = express.Router();

router.post("/", officeController.createOffice);

router.get("/", officeController.getOffices);

router.get("/:id", officeController.getOfficeById);

router.patch("/:id", officeController.updateOffice);

router.delete("/:id", officeController.deleteOffice);

export default router;