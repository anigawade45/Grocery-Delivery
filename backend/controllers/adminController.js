const User = require("../models/User");
const Review = require("../models/Review");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const SupplierVerification = require("../models/SupplierVerification");


//🔍 Get all pending supplier verifications
const adminRegister = async (req, res) => {
    try {
        const { name, email, password, role, bio, phone } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            bio,
            phone,
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPendingSuppliers = async (req, res) => {
    try {
        const pendingSuppliers = await User.find({
            role: "supplier",
            status: "pending",
        });

        res.json(pendingSuppliers);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch pending suppliers", error });
    }
};


//✅ Approve or ❌ Reject a supplier

const updateSupplierStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // expected: "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        const updatedSupplier = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json({ message: `Supplier ${status} successfully`, updatedSupplier });
    } catch (error) {
        res.status(500).json({ message: "Failed to update supplier status", error });
    }
};


//🗂️ Get all reported reviews

const getReportedReviews = async (req, res) => {
    try {
        const reported = await Review.find({ isReported: true }).populate("product user");
        res.json(reported);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reported reviews", error });
    }
};


//❌ Delete a reported review

const deleteReportedReview = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Review.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Review deleted successfully", deleted });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete review", error });
    }
};


//👥 List all users

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error });
    }
};


//📝 Update user status or role

const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { role, status } = req.body;

    try {
        const updated = await User.findByIdAndUpdate(
            id,
            { ...(role && { role }), ...(status && { status }) },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", updated });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error });
    }
};

module.exports = {
    getPendingSuppliers,
    updateSupplierStatus,
    getReportedReviews,
    deleteReportedReview,
    getAllUsers,
    updateUserStatus,
    adminRegister,
};
