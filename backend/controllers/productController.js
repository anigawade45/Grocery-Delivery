const Product = require('../models/Product');

// Controller to get all products
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to get product detail by id
const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to get products by name (partial match)
const getProductByName = async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ message: 'Name query parameter is required' });
    }
    const products = await Product.find({ name: { $regex: name, $options: 'i' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to get products by category
const getProductByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    if (!category) {
      return res.status(400).json({ message: 'Category query parameter is required' });
    }
    const products = await Product.find({ category: category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to get products by tags - placeholder since tags field does not exist
const getProductByTags = async (req, res) => {
  res.status(501).json({ message: 'getProductByTags is not implemented because tags field is missing in the product model' });
};

// Controller to get all distinct product categories
const getAllProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProduct,
  getProductDetail,
  getProductByName,
  getProductByCategory,
  getProductByTags,
  getAllProductCategories,
};
