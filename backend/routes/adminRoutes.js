const express = require("express");
const router = express.Router();
const { requireUser, restrictTo } = require("../middlewares/authMiddleware");
const {
    getPendingSuppliers,
    updateSupplierStatus,
    getReportedReviews,
    deleteReportedReview,
    getAllUsers,
    updateUserStatus
} = require("../controllers/adminController");

router.use(requireUser, restrictTo("admin"));

// Supplier Verification
router.get("/suppliers", getPendingSuppliers);
router.patch("/suppliers/:id", updateSupplierStatus);

// Reported Reviews
router.get("/reported-reviews", getReportedReviews);
router.delete("/reported-reviews/:id", deleteReportedReview);

// User Management
router.get("/users", getAllUsers);
router.patch("/users/:id", updateUserStatus);

module.exports = router;
