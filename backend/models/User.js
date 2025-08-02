const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["vendor", "supplier", "admin"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        accountStatus: {
            type: String,
            enum: ["active", "blocked"],
            default: "active",
        },
        bio: {
            type: String,
        },

        // Geospatial location
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },

        // Human-readable location fields
        formattedAddress: {
            type: String, // Full address string (like from reverse geocoding)
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Create a 2dsphere index for location
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
