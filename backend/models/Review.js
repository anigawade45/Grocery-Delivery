import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: String,
    isReported: { type: Boolean, default: false },
    reportReason: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Review", reviewSchema);
