const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getAllProduct);
router.get('/products/:id', productController.getProductDetail);
router.get('/products/search/by-name', productController.getProductByName);
router.get('/products/search/by-category', productController.getProductByCategory);
router.get('/products/search/by-tags', productController.getProductByTags);
router.get('/products/categories', productController.getAllProductCategories);

module.exports = router;
