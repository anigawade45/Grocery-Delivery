import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      }
    ],
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

export default mongoose.model("Cart", cartSchema);
