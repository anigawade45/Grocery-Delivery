const express = require("express");
const router = express.Router();
const {
    getSupplierDashboardSummary,
    getMyProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getMyReviews,
    getSupplierNotifications,
    markNotificationRead,
    deleteSupplierNotification,
    getProfile,
    updateProfile,
    restoreProduct
} = require("../controllers/supplierController");
const { requireAuth, upload } = require("../middlewares/authMiddleware");

// Dashboard Summary
router.get("/dashboard", requireAuth, getSupplierDashboardSummary);

// Product Management
router.get("/products", requireAuth, getMyProducts);
router.get("/products/:id", requireAuth, getProductById);
router.post("/products", requireAuth, upload.single("image"), addProduct);
router.patch("/products/:id/restore", requireAuth, restoreProduct);
router.patch("/products/:id", requireAuth, upload.single("image"), updateProduct);
router.delete("/products/:id", requireAuth, deleteProduct);

// Order Management
router.get("/orders", requireAuth, getMyOrders);
router.get("/orders/:id", requireAuth, getOrderById);
router.patch("/orders/:id/status", requireAuth, updateOrderStatus);


// Reviews
router.get("/reviews", requireAuth, getMyReviews);

// Notifications
router.get("/notifications", requireAuth, getSupplierNotifications);
router.patch("/notifications/:id/read", requireAuth, markNotificationRead);
router.delete("/notifications/:id", requireAuth, deleteSupplierNotification);

// Profile & Settings
router.get("/profile", requireAuth, getProfile);
router.patch("/profile", requireAuth, updateProfile);

module.exports = router;
