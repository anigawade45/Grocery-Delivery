const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
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

// Create default admins if not already present
const createDefaultAdmins = async () => {
    const admins = [
        {
            name: "Aniket Gawade",
            email: "anigawade05@gmail.com",
            password: "12345678",
            role: "admin",
            phone: "9049644592",
            bio: "First admin",
            status: "approved",
        },
        {
            name: "Admin Two",
            email: "admin2@example.com",
            password: "adminpassword2",
            role: "admin",
            phone: "9000000002",
            bio: "Second admin",
            status: "approved",
        },
    ];

    for (const admin of admins) {
        const existing = await User.findOne({ email: admin.email });
        if (!existing) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            await User.create({ ...admin, password: hashedPassword });
            console.log(`✔ Default admin created: ${admin.email}`);
        }
    }
};

module.exports = {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUserStatus,
    createDefaultAdmins,
};
