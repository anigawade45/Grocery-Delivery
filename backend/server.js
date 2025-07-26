const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());    
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));



// Routes (import and mount here)
const userRoutes = require("./routes/userRoutes");
const clerkWebhook = require("./routes/clerkWebhook");
// const productRoutes = require("./routes/product.routes");
// const orderRoutes = require("./routes/order.routes");
// const reviewRoutes = require("./routes/review.routes");
// const supplierRoutes = require("./routes/supplier.routes");

app.use("/api/users", userRoutes);
app.use("/api/webhooks", clerkWebhook);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/suppliers", supplierRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("✅ VendorVerse API is running...");
});

// MongoDB Connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () =>
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        );
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });

