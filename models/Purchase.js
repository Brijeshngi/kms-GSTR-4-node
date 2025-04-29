// Purchase model content
import { Schema, model } from "mongoose";

const purchaseSchema = new Schema(
  {
    invoiceNumber: String,
    date: Date,
    firmName: String,
    gstin: String,
    amount: Number,
    taxableAmount: Number,
    cgst: Number,
    sgst: Number,
  },
  { timestamps: true }
);

export default model("Purchase", purchaseSchema);
