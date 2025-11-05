const express = require('express');
const router = express.Router();
const {
  createTestimonial,
  getTestimonials,
  getMyTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  getTestimonialStats,
  getAllTestimonialsAdmin
} = require('../controllers/testimonialsController');
const { protect, authorize } = require('../middleware/auth');
const { validateTestimonial, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/', getTestimonials);
router.get('/stats/summary', getTestimonialStats);

// Protected routes
router.post('/', protect, validateTestimonial, handleValidationErrors, createTestimonial);
router.get('/user/my-testimonials', protect, getMyTestimonials);

// Admin routes (must be before /:id to avoid route conflicts)
router.get('/admin/all', protect, authorize('admin'), getAllTestimonialsAdmin);
router.put('/:id/approve', protect, authorize('admin'), approveTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

// Dynamic routes (must be last)
router.get('/:id', getTestimonial);

module.exports = router;
