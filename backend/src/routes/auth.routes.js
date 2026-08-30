import express from "express";
import authController from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../utils/validation.js";
import registerSchem from "../validations/auth.validation.js";
import loginSchema from "../validations/auth.validation.js"
import authRateLimiter from "../middleware/rateLimit.middleware.js";


const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/me", protect, authController.getCurrentUser);

router.get(
  "/admin-test",
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome admin",
      data: {
        user: req.user.name,
        role: req.user.role,
      },
    });
  }
);

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchem.registerSchema),
  authController.registerUser
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema.loginSchema),
  authController.loginUser
);


export default router;