const User = require("../models/User");

const assignUserRole = async (req, res) => {
    const { clerkId, role, name, email } = req.body;

    try {
        if (!clerkId || !role || !name || !email) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        let user = await User.findOne({ clerkId });

        if (user) {
            // ✅ Update role if user already exists
            user.role = role;
            user.status = "pending"; // reset status on new role assign
            await user.save();
        } else {
            // ✅ If not found, try checking by email to avoid duplication
            user = await User.findOne({ email });

            if (user) {
                return res.status(409).json({
                    success: false,
                    error: "User with this email already exists",
                });
            }

            // ✅ Create new user
            user = await User.create({
                clerkId,
                name,
                email,
                role,
                status: "pending",
            });
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error("Error assigning user role:", err.message);
        res.status(500).json({ success: false, error: err.message });
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
