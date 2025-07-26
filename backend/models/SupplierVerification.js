import mongoose from "mongoose";

const supplierDocumentsSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    files: [String],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
  }
);

export default mongoose.model("SupplierDocument", supplierDocumentsSchema);
