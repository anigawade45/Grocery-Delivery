const express = require("express");
const { clerkWebhooks } = require("../controllers/clerkWebhookController");

const router = express.Router();

router.post("/clerk", clerkWebhooks);

module.exports = router;
