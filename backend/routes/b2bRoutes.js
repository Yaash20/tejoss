const express = require('express');
const router = express.Router();
const {
  submitPartnership,
  getAllPartnerships,
  getPartnership,
  updatePartnershipStatus,
  deletePartnership,
  getPartnershipStats
} = require('../controllers/b2bController');
const { protect, authorize } = require('../middleware/auth');
const { validateB2B, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.post('/', validateB2B, handleValidationErrors, submitPartnership);

// Admin routes
router.get('/', protect, authorize('admin'), getAllPartnerships);
router.get('/stats/summary', protect, authorize('admin'), getPartnershipStats);
router.get('/:id', protect, authorize('admin'), getPartnership);
router.put('/:id/status', protect, authorize('admin'), updatePartnershipStatus);
router.delete('/:id', protect, authorize('admin'), deletePartnership);

module.exports = router;
