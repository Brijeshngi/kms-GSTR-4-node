import express from "express";
import User from "../models/User.js";
import { register, login } from "../controllers/authController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Example restricted route (admin only)
router.get(
  "/admin/dashboard",
  isAuthenticated,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: `Welcome Admin ${req.user.name}` });
  }
);

// Admin: activate/deactivate a user
router.patch(
  "/users/:id/status",
  isAuthenticated,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { status } = req.body; // "active" | "inactive"
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
        success: true,
        message: `User status updated to ${status}`,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Logged-in user's profile
router.get("/me", isAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, status: req.user.status },
  });
});

export default router;
