const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserDetails
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.get('/admin/users/:id', protect, authorize('admin'), getUserDetails);

module.exports = router;
