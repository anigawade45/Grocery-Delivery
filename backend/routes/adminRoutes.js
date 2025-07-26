const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/admin/users', adminController.getAllUsers);
router.put('/admin/users/:id/status', adminController.banOrActivateUser);
router.put('/admin/suppliers/:id/status', adminController.approveOrRejectSupplier);
router.get('/admin/suppliers/pending', adminController.viewPendingVerifications);

module.exports = router;
