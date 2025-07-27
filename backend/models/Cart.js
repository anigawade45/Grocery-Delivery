const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

module.exports = mongoose.model("Cart", cartSchema);  