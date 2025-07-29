
const express = require("express");
const router = express.Router();
const { requireUser, restrictTo } = require("../middlewares/authMiddleware");
const {
    getPendingSuppliers,
    updateSupplierStatus,
    getReportedReviews,
    deleteReportedReview,
    getAllUsers,
    updateUserStatus,
    adminRegister,
    getSupplierDetails
} = require("../controllers/adminController");

// Admin Registration
router.post("/adminregister", adminRegister); // Register a new admin
router.use(requireUser, restrictTo("admin")); // Ensure all routes below require admin privileges

// Supplier Verification
router.get("/suppliers", getPendingSuppliers); // Get all pending suppliers
router.patch("/supplier/:id", updateSupplierStatus); // Update supplier status (approve/reject)
router.get("/suppliers/:id", getSupplierDetails); // Get details of a specific supplier

// Reported Reviews
router.get("/reported-reviews", getReportedReviews); // Get all reported reviews
router.delete("/reported-reviews/:id", deleteReportedReview); // Delete a reported review

// User Management
router.get("/users", getAllUsers); // Get all users
router.patch("/users/:id", updateUserStatus); // Update user status (activate/deactivate)

module.exports = router;
