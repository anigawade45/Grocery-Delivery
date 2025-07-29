const express = require("express");

const router = express.Router();
const {
    getMyProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getMyOrders,
    updateOrderStatus,
    getMyReviews,
} = require("../controllers/supplierController");
const { requireAuth, upload } = require("../middlewares/authMiddleware");

// Product Management
router.get("/products", requireAuth, getMyProducts);
router.post("/products", requireAuth, upload.single("image"), addProduct); // Add a new product
router.patch("/products/:id", requireAuth, upload.single("image"), updateProduct); // Update an existing product
router.delete("/products/:id", requireAuth, deleteProduct); // Delete a product

// Order Management
router.get("/orders", requireAuth, getMyOrders); // Get all orders for the supplier
router.patch("/orders/:id/status", requireAuth, updateOrderStatus); // Update order status

// Reviews
router.get("/reviews", requireAuth, getMyReviews);

module.exports = router;
