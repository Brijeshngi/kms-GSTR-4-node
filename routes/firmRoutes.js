import express from "express";
import Firm from "../models/Firm.js";

const router = express.Router();

// ➕ Add new firm
router.post("/add", async (req, res) => {
  try {
    const { firmName, address, gstin } = req.body;

    if (!firmName || !address || !gstin) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const firm = await Firm.create({ firmName, address, gstin });

    res.status(201).json({
      success: true,
      message: "Firm added successfully",
      data: firm,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "GSTIN already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 📃 Get all firms
router.get("/", async (req, res) => {
  try {
    const firms = await Firm.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, data: firms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔍 Get single firm by ID
router.get("/:id", async (req, res) => {
  try {
    const firm = await Firm.findById(req.params.id);
    if (!firm) {
      return res
        .status(404)
        .json({ success: false, message: "Firm not found" });
    }
    res.status(200).json({ success: true, data: firm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ❌ Delete firm by ID
router.delete("/:id", async (req, res) => {
  try {
    const firm = await Firm.findByIdAndDelete(req.params.id);
    if (!firm) {
      return res
        .status(404)
        .json({ success: false, message: "Firm not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Firm deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✏️ Update firm by ID
router.put("/:id", async (req, res) => {
  try {
    const { firmName, address, gstin } = req.body;

    const firm = await Firm.findByIdAndUpdate(
      req.params.id,
      { firmName, address, gstin },
      { new: true, runValidators: true }
    );

    if (!firm) {
      return res
        .status(404)
        .json({ success: false, message: "Firm not found" });
    }

    res.status(200).json({
      success: true,
      message: "Firm updated successfully",
      data: firm,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "GSTIN already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
