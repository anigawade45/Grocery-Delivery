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

// router.use(requireAuth)
// Browse all products (with optional filters)
router.get("/products", getAllProducts);

// Get product details
router.get("/product/:id", requireAuth, getProductById);


// Add product to cart
router.post("/cart", requireAuth, addToCart);

// Get vendor's cart
router.get("/cart", requireAuth, getCart);

// Update cart item quantity
router.patch("/cart/:productId", requireAuth, updateCartItem);

// Remove item from cart
router.delete("/cart/:productId", requireAuth, removeFromCart);

// Place order
router.post("/order",requireAuth, placeOrder);

// Get all past orders for vendor
router.get("/orders",requireAuth, getOrderHistory);

// Get single order details
router.get("/orders/:id",requireAuth, getOrderDetails);

// Reorder past order
router.post("/orders/:id/reorder",requireAuth, reorder);

// Get/update vendor profile
router.get("/profile", requireAuth, getProfile);
router.patch("/profile", requireAuth, updateProfile);

module.exports = router;
