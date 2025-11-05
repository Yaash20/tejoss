const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  getOrderStats,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/ordersController');
const { protect, authorize } = require('../middleware/auth');
const { validateOrder, handleValidationErrors } = require('../middleware/validation');

// Protected routes
router.post('/', protect, validateOrder, handleValidationErrors, createOrder);
router.get('/', protect, getOrders);
router.get('/stats/dashboard', protect, getOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
