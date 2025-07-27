const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");

const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("name email bio role");

        if (!user) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error("Error fetching vendor profile:", err);
        res.status(500).json({ message: "Failed to get profile", error: err.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ inStock: true }).populate("supplierId", "name");
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch products", error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("supplierId");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch product", error: err.message });
    }
};


const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ vendorId: req.user._id }).populate("items.productId");
        res.status(200).json({ cart: cart || { vendorId: req.user._id, items: [] } });
    } catch (err) {
        res.status(500).json({ message: "Failed to get cart", error: err.message });
    }
};

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: "Product and quantity required" });

    try {
        let cart = await Cart.findOne({ vendorId: req.user._id });
        if (!cart) {
            cart = new Cart({ vendorId: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to update cart", error: err.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ vendorId: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
        await cart.save();
        res.status(200).json({ message: "Item removed", cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove item", error: err.message });
    }
};

const placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ vendorId: req.user._id }).populate("items.productId");
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

        const orderItems = cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

        const newOrder = new Order({
            vendorId: req.user._id,
            items: orderItems,
            totalAmount,
        });

        await newOrder.save();
        await Cart.findOneAndDelete({ vendorId: req.user._id });

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        res.status(500).json({ message: "Failed to place order", error: err.message });
    }
};

const getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ vendorId: req.user._id }).sort({ createdAt: -1 }).populate("items.productId");
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch order history", error: err.message });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, vendorId: req.user._id }).populate("items.productId");
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch order details", error: err.message });
    }
};

// PATCH /api/vendor/profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const updated = await User.findByIdAndUpdate(
            userId,
            {
                name: req.body.name,
                bio: req.body.bio,
            },
            { new: true, runValidators: true }
        ).select("name email bio role");

        res.status(200).json({ message: "Profile updated", user: updated });
    } catch (err) {
        console.error("Failed to update profile:", err);
        res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
};


const reorder = async (req, res) => {
    try {
        const vendorId = req.user._id;
        const oldOrder = await Order.findOne({ _id: req.params.id, vendorId });

        if (!oldOrder) {
            return res.status(404).json({ message: "Previous order not found" });
        }

        const newOrder = new Order({
            vendorId,
            items: oldOrder.items,
            totalAmount: oldOrder.totalAmount,
            status: "pending",
        });

        await newOrder.save();
        res.status(201).json({ message: "Reorder placed successfully", order: newOrder });
    } catch (err) {
        console.error("Error reordering:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const vendorId = req.user._id;
        const productId = req.params.productId;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        let cart = await Cart.findOne({ vendorId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({ message: "Cart item updated", cart });
    } catch (err) {
        console.error("Error updating cart item:", err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    getCart,
    addToCart,
    removeFromCart,
    placeOrder,
    getOrderHistory,
    getOrderDetails,
    updateProfile,
    reorder,
    updateCartItem,
    getProfile
};