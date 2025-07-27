const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    category: String,
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    },
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Product", productSchema);
