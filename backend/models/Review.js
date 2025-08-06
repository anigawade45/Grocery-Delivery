const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, trim: true },
    response: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// One review per vendor per product
reviewSchema.index({ productId: 1, vendorId: 1 }, { unique: true });
// Query helpers
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ vendorId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
