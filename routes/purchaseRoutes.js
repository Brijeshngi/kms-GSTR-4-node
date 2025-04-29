// purchaseRoutes.js content
import { Router } from "express";
const router = Router();
import {
  getAll,
  create,
  update,
  remove,
} from "../controllers/purchaseController.js";

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
