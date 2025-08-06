const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Notification = require("../models/Notification");
const Review = require("../models/Review");
const sendNotification = require("../middlewares/sendNotification");
const mongoose = require("mongoose");

const getVendorDashboard = async (req, res) => {
    const vendorId = req.user._id;

    const totalOrders = await Order.countDocuments({ vendorId });
    const totalAmount = await Order.aggregate([
        { $match: { vendorId } },
        { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
    ]);

    const recentOrders = await Order.find({ vendorId })
        .sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
        totalOrders,
        totalRevenue: totalAmount[0]?.revenue || 0,
        recentOrders,
    });
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }

        const user = await User.findById(userId).select(
            "name email bio role phone status accountStatus location formattedAddress city state createdAt"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            profile: {
                name: user.name,
                email: user.email,
                bio: user.bio || "",
                role: user.role,
                phone: user.phone,
                status: user.status,
                accountStatus: user.accountStatus,
                location: {
                    coordinates: user.location.coordinates,  // [lng, lat]
                    formattedAddress: user.formattedAddress || "",
                    city: user.city || "",
                    state: user.state || "",
                },
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            message: "Internal Server Error while fetching profile",
            error: error.message
        });
    }
};

// PATCH /api/vendor/profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const { name, bio, location, formattedAddress, city, state } = req.body;

        const updateFields = {};

        if (typeof name === "string") updateFields.name = name.trim();
        if (typeof bio === "string") updateFields.bio = bio.trim();

        // Optional: Validate and update location coordinates
        if (
            location &&
            Array.isArray(location.coordinates) &&
            location.coordinates.length === 2 &&
            location.coordinates.every(coord => typeof coord === "number")
        ) {
            updateFields.location = {
                type: "Point",
                coordinates: location.coordinates,
            };
        }

        if (typeof formattedAddress === "string") updateFields.formattedAddress = formattedAddress.trim();
        if (typeof city === "string") updateFields.city = city.trim();
        if (typeof state === "string") updateFields.state = state.trim();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            {
                new: true,
                runValidators: true,
            }
        ).select("name email bio role location formattedAddress city state");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        console.error("Failed to update profile:", err);
        res.status(500).json({
            message: "Failed to update profile",
            error: err.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            minPrice,
            maxPrice,
            search,
            sortBy
        } = req.query;

        const skip = (page - 1) * limit;
        const filter = { inStock: true, isDeleted: false };

        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        let sortOption = {};
        if (sortBy === "price-asc") sortOption.price = 1;
        if (sortBy === "price-desc") sortOption.price = -1;
        if (sortBy === "newest") sortOption.createdAt = -1;

        const products = await Product.find(filter)
            .populate("supplierId", "name")
            .sort(sortOption)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            products,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch products", error: err.message });
    }
};


const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("supplierId", "name"); // ✅ only populate the 'name' field

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch product", error: err.message });
    }
};

// GET /api/vendor/nearby-products?coordinates=longitude,latitude
const getNearbyProductsFromSuppliers = async (req, res) => {
    try {
        const { coordinates } = req.query;
        if (!coordinates || !coordinates.includes(",")) {
            return res.status(400).json({ message: "Query must include coordinates as 'longitude,latitude'" });
        }

        const [lng, lat] = coordinates.split(",").map(Number);
        if (isNaN(lng) || isNaN(lat)) {
            return res.status(400).json({ message: "Invalid coordinate values" });
        }

        // Step 1: Find nearby suppliers
        const nearbySuppliers = await User.find({
            role: "supplier",
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: 10000, // 10km
                },
            },
        }).select("_id");

        if (!nearbySuppliers.length) {
            return res.status(404).json({ message: "No suppliers found within 10km" });
        }

        // Step 2: Find products from these suppliers
        const supplierIds = nearbySuppliers.map(s => s._id);
        const products = await Product.find({
            supplierId: { $in: supplierIds },
            inStock: true,
        }).populate("supplierId", "name location");

        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching nearby products:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
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

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ vendorId: req.user._id })
            .populate({
                path: "items.productId",
                populate: {
                    path: "supplierId",
                    select: "name"  // only populate the supplier's name
                }
            });

        res.status(200).json({ cart: cart || { vendorId: req.user._id, items: [] } });
    } catch (err) {
        res.status(500).json({ message: "Failed to get cart", error: err.message });
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
        const vendorId = req.user._id;
        const vendor = await User.findById(vendorId);

        // Get cart items for the vendor
        const cart = await Cart.findOne({ vendorId }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const items = cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));

        const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        const uniqueSupplierIds = [...new Set(cart.items.map(item => item.productId.supplierId.toString()))];

        if (uniqueSupplierIds.length !== 1) {
            return res.status(400).json({ message: "All products in cart must be from the same supplier" });
        }

        const supplierId = uniqueSupplierIds[0];

        const { deliveryDate } = req.body;
        if (!deliveryDate) {
            return res.status(400).json({ message: "Delivery date is required" });
        }

        const newOrder = new Order({
            vendorId,
            items,
            totalAmount,
            deliveryDate,
            supplierId,
        });

        await newOrder.save();
        await Cart.findOneAndDelete({ vendorId });
        await sendNotification({
            userId: newOrder.supplierId,  // FIXED
            type: "order",
            message: `You have a new order from vendor ${vendor.name}.`, // vendorId is an ObjectId, not .name
        });

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ vendorId: req.user._id })
            .sort({ createdAt: -1 })
            .populate("items.productId")
            .populate("supplierId", "name"); // Only populate supplier name

        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch order history", error: err.message });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, vendorId: req.user._id })
            .populate("items.productId")
            .populate("supplierId", "name");

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch order details", error: err.message });
    }
};

const reorder = async (req, res) => {
    try {
        const vendorId = req.user._id;
        const vendor = await User.findById(vendorId);
        const oldOrder = await Order.findOne({ _id: req.params.id, vendorId });

        if (!oldOrder) {
            return res.status(404).json({ message: "Previous order not found" });
        }
        // Set delivery date to 3 days from now
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);

        const newOrder = new Order({
            vendorId,
            items: oldOrder.items,
            totalAmount: oldOrder.totalAmount,
            status: "pending",
            supplierId: oldOrder.supplierId, // ✅ Required field
            deliveryDate,                   // ✅ Required field
        });

        await newOrder.save();
        await sendNotification({
            userId: newOrder.supplierId,  // FIXED
            type: "order",
            message: `You have a new order from vendor ${vendor.name}.`,
        });

        res.status(201).json({ message: "Reorder placed successfully", order: newOrder });
    } catch (err) {
        console.error("Error reordering:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getVendorNotifications = async (req, res) => {
    try {
        const vendorId = req.user._id;
        const notifications = await Notification.find({ userId: vendorId, isRead: false }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
    }
};

const markNotificationRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const vendorId = req.user._id;
        const existingNotification = await Notification.findById(notificationId);

        // check if notification is already read
        if (existingNotification.isRead) {
            return res.status(200).json({ message: "Notification is already read" });
        }
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (err) {
        console.error("Error marking notification as read:", err);
        res.status(500).json({ message: "Failed to mark notification as read", error: err.message });
    }
};

const deleteVendorNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const vendorId = req.user._id;

        if (!notificationId) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await Notification.findByIdAndDelete(notificationId);
        await User.findByIdAndUpdate(vendorId, { $inc: { notificationCount: -1 } }, { new: true });

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
        console.error("Error deleting notification:", err);
        res.status(500).json({ message: "Failed to delete notification", error: err.message });
    }
};

const getProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    try {
        const reviews = await Review.find({ productId })
            .populate("vendorId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (err) {
        console.error("Fetch Product Reviews Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ vendorId: req.user._id }).populate("productId", "name image");
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Get My Reviews Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

async function recomputeProductRating(productId) {
    // Normalize to ObjectId safely
    const pid =
        typeof productId === "string"
            ? new mongoose.Types.ObjectId(productId)
            : productId; // already ObjectId

    const stats = await Review.aggregate([
        { $match: { productId: pid } },
        {
            $group: {
                _id: "$productId",
                avg: { $avg: "$rating" },
                count: { $sum: 1 },
            },
        },
    ]);

    const avg = stats[0]?.avg ?? 0;
    const count = stats[0]?.count ?? 0;

    // Make sure your Product schema actually has these fields
    await Product.updateOne(
        { _id: pid },
        {
            $set: {
                avgRating: Math.round(avg * 10) / 10, // 1 decimal
                ratingsCount: count,
            },
        }
    );

    return { avg, count };
}

// POST /api/vendor/reviews
const submitReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const vendorId = req.user._id;

    try {
        if (!productId || !rating) {
            return res.status(400).json({ message: "productId and rating are required" });
        }

        const existing = await Review.findOne({ productId, vendorId });
        if (existing) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }

        const review = await Review.create({ productId, vendorId, rating, comment });

        // Recompute product stats
        await recomputeProductRating(productId);

        res.status(201).json({ message: "Review submitted", review });
    } catch (err) {
        console.error("Submit Review Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PATCH /api/vendor/reviews/:id
const editReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const vendorId = req.user._id;

    try {
        const review = await Review.findOne({ _id: id, vendorId });
        if (!review) return res.status(404).json({ message: "Review not found" });

        if (rating != null) review.rating = rating;
        if (comment != null) review.comment = comment;
        await review.save();

        // Recompute after edit
        await recomputeProductRating(review.productId);

        res.status(200).json({ message: "Review updated", review });
    } catch (err) {
        console.error("Edit Review Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/vendor/reviews/:id
const deleteReview = async (req, res) => {
    const { id } = req.params;
    const vendorId = req.user._id;

    try {
        const review = await Review.findOne({ _id: id, vendorId });
        if (!review) return res.status(404).json({ message: "Review not found or unauthorized" });

        const productId = review.productId;
        await review.deleteOne();

        // Recompute after delete
        await recomputeProductRating(productId);

        res.status(200).json({ message: "Review deleted" });
    } catch (err) {
        console.error("Delete Review Error:", err);
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
    getProfile,
    getNearbyProductsFromSuppliers,
    getVendorNotifications,
    markNotificationRead,
    getVendorDashboard,
    deleteVendorNotification,
    submitReview,
    getProductReviews,
    getMyReviews,
    editReview,
    deleteReview
};