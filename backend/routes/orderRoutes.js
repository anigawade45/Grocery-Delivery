const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orders', orderController.placeNewOrder);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.modifyOrder);
router.delete('/orders/:id', orderController.cancelOrder);

module.exports = router;
