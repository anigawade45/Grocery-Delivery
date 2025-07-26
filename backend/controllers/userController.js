const User = require("../models/User");

// Assign role and store metadata after signup
const assignUserRole = async (req, res) => {
    const { clerkId, role, phone, bio } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { clerkId },
            {
                role,
                phone,
                bio,
                status: "pending",
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by MongoDB _id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by Clerk ID
const getUserByClerkId = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin updates verification status (approve/reject)
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Status updated", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    assignUserRole,
    getAllUsers,
    getUserById,
    getUserByClerkId,
    updateUserStatus,
};
