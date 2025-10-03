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
      match: [/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/, "Invalid GSTIN format"],
    },
  },
  { timestamps: true }
);

const Firm = mongoose.model("Firm", firmSchema);

export default Firm;
