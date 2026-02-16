import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";

import { getAll, create, update, remove } from "../controllers/purchaseController.js";

const router = Router();

// 🔐 All purchase features require active, authenticated user
router.use(isAuthenticated);

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
