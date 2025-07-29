const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);
router.post('/reviews', reviewController.postReviewThroughOrderId);  // Endpoint to post a review through order ID
router.get('/reviews/supplier/:id', reviewController.getReviewsForSupplier); // Endpoint to get reviews for a specific supplier
router.put('/reviews/:id/reply', reviewController.supplierReplyToReview); // Endpoint for supplier to reply to a review
router.get('/reviews/vendor/:id', reviewController.getVendorPastFeedback);  // Endpoint to get vendor's past feedback

module.exports = router;
