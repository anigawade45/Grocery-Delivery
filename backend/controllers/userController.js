const User = require("../models/User");

const { clerkClient } = require("@clerk/clerk-sdk-node");

const assignUserRole = async (req, res) => {
    const { clerkId, role } = req.body;

    if (!clerkId || !role) {
        return res.status(400).json({ error: "Missing clerkId or role" });
    }

    try {
        await clerkClient.users.updateUser(clerkId, {
            publicMetadata: { role },
        });

        return res.status(200).json({ message: "Role updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update role", details: error.message });
    }
};

// Get all users (admin use)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users." });
    }
};

module.exports = { assignUserRole, getAllUsers };   