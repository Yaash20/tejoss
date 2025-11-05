const { query } = require('../config/database');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { unread, limit = 50 } = req.query;

    let queryText = 'SELECT * FROM notifications WHERE user_id = $1';
    const params = [user_id];
    let paramCount = 2;

    if (unread === 'true') {
      queryText += ` AND is_read = false`;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    const result = await query(queryText, params);

    // Get unread count
    const countResult = await query(
      'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = $1 AND is_read = false',
      [user_id]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      unreadCount: parseInt(countResult.rows[0].unread_count),
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notifikasi ditandai sudah dibaca',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    await query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [user_id]
    );

    res.status(200).json({
      success: true,
      message: 'Semua notifikasi ditandai sudah dibaca'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notifikasi berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/clear-read
// @access  Private
exports.clearReadNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    await query(
      'DELETE FROM notifications WHERE user_id = $1 AND is_read = true',
      [user_id]
    );

    res.status(200).json({
      success: true,
      message: 'Notifikasi yang sudah dibaca berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
