import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Auth middleware:
 * - Requires `Authorization: Bearer <token>`
 * - Loads user into `req.user`
 * - Blocks requests if user status is not active
 */
export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.status !== "active") {
      return res.status(403).json({
        message: "User is inactive. Please contact admin to activate your account.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};
