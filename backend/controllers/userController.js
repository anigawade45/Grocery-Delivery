const User = require("../models/User");

// Create or update user from Clerk webhook or client-side request
exports.upsertUser = async (req, res) => {
    try {
        const { clerkId, name, email, phone, role, bio } = req.body;

        const user = await User.findOneAndUpdate(
            { clerkId },
            { name, email, phone, role, bio },
            { upsert: true, new: true }
        );

        res.status(200).json(user);
    } catch (error) {
        console.error("User Upsert Error:", error);
        res.status(500).json({ error: "Server error while creating user." });
    }
};

// Get all users (admin use)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users." });
    }
};
