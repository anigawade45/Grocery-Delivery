const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const User = require("../models/User");
const Notification = require("../models/Notification");
const sendNotification = require("../middlewares/sendNotification");
const { cloudinary } = require("../config/cloudinary");

const getSupplierDashboardSummary = async (req, res) => {
    try {
        const supplierId = req.user._id;
        const totalProducts = await Product.countDocuments({ supplierId });
        const orders = await Order.find({ supplierId });
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Monthly breakdown
        const monthlyMap = {};

        orders.forEach((order) => {
            const date = new Date(order.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!monthlyMap[key]) {
                monthlyMap[key] = { month: key, revenue: 0, orders: 0 };
            }
            monthlyMap[key].revenue += order.totalAmount;
            monthlyMap[key].orders += 1;
        });

        const monthlyData = Object.values(monthlyMap).sort((a, b) =>
            a.month.localeCompare(b.month)
        );

        res.status(200).json({
            totalProducts,
            totalOrders,
            totalRevenue,
            monthlyData,
        });
    } catch (error) {
        console.error("Dashboard summary error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }
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

// 1. List all products added by the supplier
const getMyProducts = async (req, res) => {
    try {
        const supplierId = req.user._id;
        const products = await Product.find({ supplierId });
        res.status(200).json({ products });
    } catch (err) {
        console.error("Error fetching supplier products:", err);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};


const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("supplierId");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ product });
    } catch (err) {
        console.error("Error fetching product details:", err);
        res.status(500).json({ message: "Failed to fetch product details" });
    }
};

const addProduct = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        const { name, unit, category, price, description, stock } = req.body;

        if (!name || !unit || !category || !price || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const imageData = req.file;
        if (!imageData) return res.status(400).json({ message: "Image is required" });

        const product = new Product({
            name,
            unit,
            category,
            price,
            description,
            image: {
                url: imageData.path,
                public_id: imageData.filename
            },
            stock,
            supplierId: req.user._id,
        });


        await product.save();
        res.status(201).json({ message: "Product added", product });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "Failed to add product" });
    }
};

// 3. Update product details
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierId = req.user._id;

        const updateData = {
            ...req.body,
        };

        if (req.file?.path) {
            updateData.image = req.file.path;
        }

        const product = await Product.findOneAndUpdate(
            { _id: id, supplierId, isDeleted: false },
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        res.status(200).json({ message: "Product updated", product });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ message: "Failed to update product" });
    }
};

// 4. Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierId = req.user._id;

        const product = await Product.findOneAndUpdate(
            { _id: id, supplierId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found or already deleted" });
        }

        res.status(200).json({ message: "Product soft-deleted successfully", product });
    } catch (err) {
        console.error("Error soft-deleting product:", err);
        res.status(500).json({ message: "Failed to delete product" });
    }
};

const restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierId = req.user._id;

        const product = await Product.findOneAndUpdate(
            { _id: id, supplierId, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Deleted product not found" });
        }

        res.status(200).json({ message: "Product restored", product });
    } catch (err) {
        console.error("Error restoring product:", err);
        res.status(500).json({ message: "Failed to restore product" });
    }
};


const getMyOrders = async (req, res) => {
    try {
        const supplierId = req.user._id;

        const orders = await Order.find({ supplierId })
            .populate("items.productId", "name price image status")
            .populate("vendorId") // 👈 Populate vendor name and email
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (err) {
        console.error("Error fetching supplier orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const supplierId = req.user._id;
        const orderId = req.params.id;

        const order = await Order.findOne({ _id: orderId, supplierId })
            .populate("vendorId") // ✅ populate vendor info
            .populate("items.productId", "name price image");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (err) {
        console.error("Error fetching order by ID:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        await sendNotification({
            userId: order.vendorId,
            message: `Your order status was updated to "${status}"`,
            type: "order",
        });

        res.json({ message: "Order status updated", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// 7. Get reviews for supplier's products
const getMyReviews = async (req, res) => {
    try {
        const supplierId = req.user._id;

        const reviews = await Review.find()
            .populate("productId", "name supplierId")
            .populate("userId", "name");

        const filtered = reviews.filter(
            (r) => r.productId?.supplierId?.toString() === supplierId.toString()
        );

        res.status(200).json({ reviews: filtered });
    } catch (err) {
        console.error("Error fetching supplier reviews:", err);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

const getSupplierNotifications = async (req, res) => {
    try {
        const supplierId = req.user._id;
        const notifications = await Notification.find({ userId: supplierId, isRead: false }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
    }
};

const markNotificationRead = async (req, res) => {
    try {
        const notificationId = req.params.id; // ✅ correct param key
        const supplierId = req.user._id;
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

const deleteSupplierNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const supplierId = req.user._id;

        if (!notificationId) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await Notification.findByIdAndDelete(notificationId);
        await User.findByIdAndUpdate(supplierId, { $inc: { notificationCount: -1 } }, { new: true });

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
        console.error("Error deleting notification:", err);
        res.status(500).json({ message: "Failed to delete notification", error: err.message });
    }
};

module.exports = {
    getSupplierDashboardSummary,
    getProfile,
    updateProfile,
    getProductById,
    getMyProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getMyReviews,
    getSupplierNotifications,
    markNotificationRead,
    deleteSupplierNotification,
};
