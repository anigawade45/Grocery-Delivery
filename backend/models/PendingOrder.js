const mongoose = require("mongoose");

const pendingOrderSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: Number,
            price: Number,
        }
    ],
    totalAmount: Number,
    deliveryDate: Date,
    paymentMethod: String,
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const PendingOrder = mongoose.model("PendingOrder", pendingOrderSchema);
module.exports = PendingOrder;
