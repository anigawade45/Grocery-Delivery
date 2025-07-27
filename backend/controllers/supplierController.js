const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const { cloudinary } = require("../config/cloudinary");

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
            { _id: id, supplierId },
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

        const result = await Product.findOneAndDelete({ _id: id, supplierId });

        if (!result) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "Failed to delete product" });
    }
};

// 5. Get all orders containing items from this supplier
const getMyOrders = async (req, res) => {
    try {
        const supplierId = req.user._id;

        const orders = await Order.find({ "items.supplierId": supplierId })
            .populate("items.productId", "name price image")
            .sort({ createdAt: -1 });

        const filteredOrders = orders.map((order) => {
            const supplierItems = order.items.filter(
                (item) => item.supplierId.toString() === supplierId.toString()
            );
            return {
                _id: order._id,
                createdAt: order.createdAt,
                status: order.status,
                items: supplierItems,
            };
        });

        res.status(200).json({ orders: filteredOrders });
    } catch (err) {
        console.error("Error fetching supplier orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// 6. Update delivery status of supplier's items in an order
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const supplierId = req.user._id;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        let updated = false;

        order.items = order.items.map((item) => {
            if (item.supplierId.toString() === supplierId.toString()) {
                item.deliveryStatus = status;
                updated = true;
            }
            return item;
        });

        if (!updated) {
            return res.status(403).json({ message: "No items to update for this supplier" });
        }

        await order.save();
        res.status(200).json({ message: "Delivery status updated", order });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ message: "Failed to update status" });
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

module.exports = {
    getMyProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getMyOrders,
    updateOrderStatus,
    getMyReviews,
};
