const express = require("express");
const router = express.Router();
const { handleClerkWebhook } = require("../controllers/clerkWebhookController");

router.post("/", express.json({ type: "application/json" }), handleClerkWebhook);

module.exports = router;
