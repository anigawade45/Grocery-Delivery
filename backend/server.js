const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// 🌐 Other middlewares
app.use(cors());

app.use(
    cors({
        origin: process.env.FRONTEND_URL, // frontend origin
        credentials: true, // allow cookies/headers
    })
);

app.use(express.json()); // body parser for all routes

// 🚏 Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const reviewRoutes = require("./routes/reviewRoutes");


app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/reviews", reviewRoutes);

// Optional (for future use)
// const productRoutes = require("./routes/product.routes");
// const orderRoutes = require("./routes/order.routes");
// const reviewRoutes = require("./routes/review.routes");
// const supplierRoutes = require("./routes/supplier.routes");

// ❤️ Health Check
app.get("/", (req, res) => {
    res.send("✅ VendorVerse API is running...");
});

// 🚀 MongoDB Connect
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });
