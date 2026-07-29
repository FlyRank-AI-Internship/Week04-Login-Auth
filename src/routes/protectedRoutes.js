import { Router } from "express";
import {
  authenticate,
  requireAdmin
} from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", authenticate, (req, res) => {
  return res.status(200).json({
    message: "Protected profile accessed successfully",
    user: {
      id: req.user.id,
      email: req.user.email,
      created_at: req.user.created_at,
      last_sign_in_at: req.user.last_sign_in_at
    }
  });
});

router.get("/dashboard", authenticate, (req, res) => {
  return res.status(200).json({
    message: "Welcome to your protected dashboard",
    user_id: req.user.id,
    email: req.user.email
  });
});

/**
 * Stretch requirement demonstrating 403 Forbidden.
 */
router.get("/admin", authenticate, requireAdmin, (req, res) => {
  return res.status(200).json({
    message: "Welcome to the admin area",
    user_id: req.user.id
  });
});

export default router;