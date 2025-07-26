const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.post('/supplier/products', supplierController.addNewProduct);
router.get('/supplier/products/:supplierId', supplierController.listProducts);
router.put('/supplier/products/:id', supplierController.editProductById);
router.delete('/supplier/products/:id', supplierController.deleteProductById);
router.get('/supplier/orders/:supplierId', supplierController.listIncomingOrders);
router.put('/supplier/orders/:id/status', supplierController.updateOrderStatusById);

module.exports = router;
