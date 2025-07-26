const Order = require('../models/Order');

// Vendor places a new order
const placeNewOrder = async (req, res) => {
  try {
    const { vendorId, items, totalAmount } = req.body;
    if (!vendorId || !items || !totalAmount) {
      return res.status(400).json({ message: 'vendorId, items, and totalAmount are required' });
    }
    const newOrder = new Order({
      vendorId,
      items,
      totalAmount,
      status: 'pending',
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Track specific order by id
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('vendorId').populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Modify order before dispatch (status pending or processing)
const modifyOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updates = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ message: 'Order cannot be modified after dispatch' });
    }
    // Update allowed fields: items, totalAmount, status (optional)
    if (updates.items) order.items = updates.items;
    if (updates.totalAmount) order.totalAmount = updates.totalAmount;
    if (updates.status && ['pending', 'processing', 'delivered', 'cancelled'].includes(updates.status)) {
      order.status = updates.status;
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel order before dispatch (status pending or processing)
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ message: 'Order cannot be cancelled after dispatch' });
    }
    order.status = 'cancelled';
    const cancelledOrder = await order.save();
    res.json(cancelledOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  placeNewOrder,
  getOrderById,
  modifyOrder,
  cancelOrder,
};
