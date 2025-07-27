const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            _id: decoded.userId,
            role: decoded.role,
        };

        console.log("Authenticated user:", req.user);
        console.log("Decoded token:", decoded);

        next();
    } catch (err) {
        console.error("JWT decode error:", err.message);
        res.status(401).json({ message: "Invalid token" });
    }
};


// Role-based access control
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied: insufficient permissions." });
        }
        next();
    };
};

module.exports = { requireAuth, restrictTo };
