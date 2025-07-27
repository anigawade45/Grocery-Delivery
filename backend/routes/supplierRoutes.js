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
router.post(
    "/products",
    requireAuth,
    upload.single("image"),
    addProduct
);
router.patch("/products/:id", requireAuth, upload.single("image"), updateProduct);
router.delete("/products/:id", requireAuth, deleteProduct);

// Order Management
router.get("/orders", requireAuth, getMyOrders);
router.patch("/orders/:id/status", requireAuth, updateOrderStatus);

// Reviews
router.get("/reviews", requireAuth, getMyReviews);

module.exports = router;
