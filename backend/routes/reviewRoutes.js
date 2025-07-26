const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/reviews', reviewController.postReviewThroughOrderId);
router.get('/reviews/supplier/:id', reviewController.getReviewsForSupplier);
router.put('/reviews/:id/reply', reviewController.supplierReplyToReview);
router.get('/reviews/vendor/:id', reviewController.getVendorPastFeedback);

module.exports = router;