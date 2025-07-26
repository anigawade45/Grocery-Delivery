const express = require("express");
const router = express.Router();
const {
    assignUserRole,
    getAllUsers,
    getUserById,
    getUserByClerkId,
    updateUserStatus,
} = require("../controllers/userController");

const { requireUser, restrictTo } = require("../middlewares/authMiddleware");
router.use(requireUser);
router.post("/assign-role", assignUserRole);
router.get("/", restrictTo("admin"), getAllUsers);
router.get("/:id", getUserById);
router.get("/clerk/:clerkId", getUserByClerkId);
router.patch("/:id/status", restrictTo("admin"), updateUserStatus);

module.exports = router;
