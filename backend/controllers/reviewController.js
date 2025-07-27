const Review = require('../models/Review');
const Order = require('../models/Order');

// Post review through order id
const postReviewThroughOrderId = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    if (!orderId || !rating) {
      return res.status(400).json({ message: 'orderId and rating are required' });
    }
    // Find order to get vendorId and productId(s)
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // For simplicity, create one review per product in order
    const reviews = [];
    for (const item of order.items) {
      const review = new Review({
        productId: item.productId,
        vendorId: order.vendorId,
        orderId: order._id,
        rating,
        comment,
      });
      await review.save();
      reviews.push(review);
    }
    res.status(201).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews for supplier through its id (vendorId)
const getReviewsForSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    if (!supplierId) {
      return res.status(400).json({ message: 'Supplier id is required' });
    }
    // Find reviews where vendorId matches supplierId
    const reviews = await Review.find({ vendorId: supplierId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Supplier replying to review
const supplierReplyToReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { supplierReply } = req.body;
    if (!supplierReply) {
      return res.status(400).json({ message: 'supplierReply is required' });
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    review.supplierReply = supplierReply;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check vendor's past feedback through its id (vendorId)
const getVendorPastFeedback = async (req, res) => {
  try {
    const vendorId = req.params.id;
    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor id is required' });
    }
    const reviews = await Review.find({ vendorId: vendorId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  postReviewThroughOrderId,
  getReviewsForSupplier,
  supplierReplyToReview,
  getVendorPastFeedback,
};