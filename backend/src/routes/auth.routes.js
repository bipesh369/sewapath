import express from "express";
import registerUser from "../controllers/auth.controller.js";
import authController from "../controllers/auth.controller.js";
import getCurrentUser from "../middleware/auth.middleware.js"
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", protect, getCurrentUser);


export default router;