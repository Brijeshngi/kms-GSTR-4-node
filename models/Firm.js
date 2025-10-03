import mongoose from "mongoose";

const firmSchema = new mongoose.Schema(
  {
    firmName: {
      type: String,
      required: [true, "Firm name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    gstin: {
      type: String,
      required: [true, "GSTIN is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Firm = mongoose.model("Firm", firmSchema);

export default Firm;
