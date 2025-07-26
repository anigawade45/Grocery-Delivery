const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { clerkMiddleware } = require("@clerk/express");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(
    "/api/webhooks",
    bodyParser.raw({ type: "application/json" })
);

// 🌐 Other middlewares
app.use(cors());
app.use(express.json()); // regular body parser for all other routes
app.use(clerkMiddleware());

// 🚏 Routes
const userRoutes = require("./routes/userRoutes");
const clerkWebhook = require("./routes/clerkWebhook");

app.use("/api/users", userRoutes);
app.use("/api/webhooks", clerkWebhook);

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
