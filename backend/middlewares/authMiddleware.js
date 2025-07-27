const jwt = require("jsonwebtoken");

// JWT authentication middleware
const requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
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
