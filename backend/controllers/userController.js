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
