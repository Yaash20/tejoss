const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications
} = require('../controllers/notificationsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/clear-read', protect, clearReadNotifications);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
