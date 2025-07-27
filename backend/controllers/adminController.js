const User = require("../models/User");
const Review = require("../models/Review");
const bcrypt = require("bcryptjs");

//🔐 Admin Registration
const adminRegister = async (req, res) => {
    try {
        const { name, email, password, role, bio, phone } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role, bio, phone });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//📋 Get all pending suppliers
const getPendingSuppliers = async (req, res) => {
    try {
        const suppliers = await User.find({ role: "supplier", status: "pending" }).select("-password");
        res.status(200).json({ suppliers });
    } catch (err) {
        console.error("Error fetching pending suppliers:", err);
        res.status(500).json({ message: "Failed to fetch pending suppliers" });
    }
};

//📄 Get supplier details
const getSupplierDetails = async (req, res) => {
    try {
        const supplier = await User.findOne({ _id: req.params.id, role: "supplier" }).select("-password");
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        res.status(200).json({ supplier });
    } catch (err) {
        console.error("Error fetching supplier details:", err);
        res.status(500).json({ message: "Failed to fetch supplier details" });
    }
};

//✅ Update supplier status
const updateSupplierStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const supplier = await User.findOneAndUpdate(
            { _id: id, role: "supplier" },
            { status },
            { new: true }
        ).select("-password");

        if (!supplier) return res.status(404).json({ message: "Supplier not found" });

        res.status(200).json({ message: `Supplier ${status}`, supplier });
    } catch (err) {
        console.error("Error updating supplier status:", err);
        res.status(500).json({ message: "Failed to update supplier status" });
    }
};

//⚠️ Get all reported reviews (Only this part changed)
const getReportedReviews = async (req, res) => {
    try {
        const reportedReviews = await Review.find({ isReported: true }).populate("productId user", "name email");
        res.status(200).json({ reviews: reportedReviews });
    } catch (err) {
        console.error("Error fetching reported reviews:", err);
        res.status(500).json({ message: "Failed to fetch reported reviews" });
    }
};

//🗑 Delete reported review
const deleteReportedReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ message: "Failed to delete review" });
    }
};

//👥 Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountStatus } = req.body;

        if (!["active", "blocked"].includes(accountStatus)) {
            return res.status(400).json({ message: "Invalid accountStatus value" });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { accountStatus },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User account status updated", user });
    } catch (err) {
        console.error("Error updating user account status:", err);
        res.status(500).json({ message: "Failed to update user account status" });
    }
};


module.exports = {
    adminRegister,
    getPendingSuppliers,
    getSupplierDetails,
    updateSupplierStatus,
    getReportedReviews,
    deleteReportedReview,
    getAllUsers,
    updateUserStatus,
};
