const express = require("express");
const router = express.Router();
const {
    upsertUser,
    getAllUsers,
} = require("../controllers/userController");

// POST or PUT user from frontend or Clerk webhook
router.post("/upsert", upsertUser);

// GET all users (for admin panel)
router.get("/", getAllUsers);

module.exports = router;
