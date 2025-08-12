const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    placeOrder,
    getOrderHistory,
    getOrderDetails,
    reorder,
    getProfile,
    updateProfile,
    getNearbyProductsFromSuppliers,
    getVendorNotifications,
    markNotificationRead,
    deleteVendorNotification,
    getVendorDashboard,
    submitReview,
    getProductReviews,
    getMyReviews,
    editReview,
    deleteReview,
} = require("../controllers/vendorController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Vendor dashboard routes
router.get("/dashboard", requireAuth, getVendorDashboard); // Get vendor dashboard data
// Product routes

// Vendor profile routes
router.get("/profile", requireAuth, getProfile);  // Get vendor profile
router.patch("/profile", requireAuth, updateProfile); // Update vendor profile

router.get("/products", requireAuth, getAllProducts);  // Browse all products (with optional filters)
router.get("/product/:id", requireAuth, getProductById); // Get product details
router.get("/products/nearby", requireAuth, getNearbyProductsFromSuppliers); // Get nearby products from suppliers

// Cart routes
router.post("/cart", requireAuth, addToCart); // Add product to cart
router.get("/cart", requireAuth, getCart);  // Get cart items
router.patch("/cart/:productId", requireAuth, updateCartItem); // Update cart item quantity
router.delete("/cart/:productId", requireAuth, removeFromCart);  // Remove item from cart

// Order routes
router.post("/order", requireAuth, placeOrder); // Place an order
router.get("/orders", requireAuth, getOrderHistory); // Get order history
router.get("/orders/:id", requireAuth, getOrderDetails);  // Get order details by ID
router.post("/orders/:id/reorder", requireAuth, reorder);  // Reorder an order by ID

//Reviews
router.post("/reviews", requireAuth, submitReview);
router.get("/reviews/product/:id", requireAuth, getProductReviews);
router.get("/reviews/mine", requireAuth, getMyReviews);
router.patch("/reviews/:id", requireAuth, editReview);
router.delete("/reviews/:id", requireAuth, deleteReview);

// Notification routes
router.get("/notifications", requireAuth, getVendorNotifications);
router.patch("/notifications/:id/read", requireAuth, markNotificationRead);
router.delete("/notifications/:id", requireAuth, deleteVendorNotification);


module.exports = router;
