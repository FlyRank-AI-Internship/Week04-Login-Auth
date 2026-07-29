import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  signup,
  login,
  logout,
  refreshAccessToken
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    error: "Too many failed login attempts. Please try again later."
  }
});

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.post("/logout", authenticate, logout);

/**
 * Stretch endpoint.
 */
router.post("/refresh", refreshAccessToken);

export default router;