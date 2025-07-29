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
} = require("../controllers/vendorController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Product routes
router.get("/products", getAllProducts);  // Browse all products (with optional filters)
router.get("/product/:id", requireAuth, getProductById); // Get product details

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

// Vendor profile routes
router.get("/profile", requireAuth, getProfile);  // Get vendor profile
router.patch("/profile", requireAuth, updateProfile); // Update vendor profile

module.exports = router;
