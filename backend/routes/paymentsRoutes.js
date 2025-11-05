const express = require('express');
const router = express.Router();
const {
  processPayment,
  uploadPaymentProof,
  verifyPayment,
  getPaymentByOrder,
  createMidtransTransaction,
  handleMidtransNotification,
  checkMidtransStatus
} = require('../controllers/paymentsController');
const { protect, authorize } = require('../middleware/auth');

// Midtrans routes
router.post('/midtrans/create', protect, createMidtransTransaction);
router.post('/midtrans/notification', handleMidtransNotification); // Public - called by Midtrans
router.get('/midtrans/status/:orderNumber', protect, checkMidtransStatus);

// Protected routes
router.post('/', protect, processPayment);
router.post('/upload-proof', protect, uploadPaymentProof);
router.get('/order/:orderId', protect, getPaymentByOrder);

// Admin routes
router.put('/:id/verify', protect, authorize('admin'), verifyPayment);

module.exports = router;
