const User = require("../models/User");

// Middleware to fetch user from DB using Clerk ID
const requireUser = async (req, res, next) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ error: "Unauthorized: No Clerk user ID found." });
        }

        const user = await User.findOne({ clerkId: clerkUserId });

        if (!user) {
            return res.status(404).json({ error: "User not found in database." });
        }

        req.user = user; // Attach full user to request object
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Middleware to restrict route by role
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied: insufficient permissions." });
        }
        next();
    };
};

module.exports = { requireUser, restrictTo };
