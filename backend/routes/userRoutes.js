const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users/upsert', userController.upsertUser);
router.get('/users', userController.getAllUsers);

module.exports = router;
