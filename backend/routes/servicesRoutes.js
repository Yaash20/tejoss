const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getAllServicesAdmin,
  getService,
  getServicesByCategory,
  createService,
  updateService,
  deleteService
} = require('../controllers/servicesController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllServices);
router.get('/category/:category', getServicesByCategory);

// Admin routes (must be before /:id to avoid route conflicts)
router.get('/admin/all', protect, authorize('admin'), getAllServicesAdmin);
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

// Dynamic routes (must be last)
router.get('/:id', getService);

module.exports = router;
