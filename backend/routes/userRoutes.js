const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUserStatus,
} = require("../controllers/userController");

const { requireAuth, restrictTo } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/", restrictTo("admin"), getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/status", restrictTo("admin"), updateUserStatus);


module.exports = router;
