const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv")
const stripeWebhook = require("./controllers/stripeWebhookController");

dotenv.config();

const app = express();

app.use(
    cors({
        origin: [
            "https://grocery-delivery-wheat.vercel.app",
            "http://localhost:5173"
        ],
        credentials: true,
    })
);

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json()); // body parser for all routes

// 🚏 Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/supplier", supplierRoutes);

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
