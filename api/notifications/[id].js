// Notifications: Mark single notification as read
const { supabase } = require('../../lib/supabase');
const { protect } = require('../../lib/auth');
const { success, error, notFound, forbidden, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return error(res, 'Notification ID diperlukan', 400);
  }

  // Only allow PATCH/PUT
  if (req.method !== 'PATCH' && req.method !== 'PUT') {
    return error(res, 'Method not allowed', 405);
  }

  // Verify authentication
  const user = await protect(req);

  // Get notification
  const { data: notification, error: fetchError } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !notification) {
    return notFound(res, 'Notification tidak ditemukan');
  }

  // Check if notification belongs to user
  if (notification.user_id !== user.id) {
    return forbidden(res, 'Anda tidak memiliki akses ke notification ini');
  }

  // Mark as read
  const { data: updatedNotification, error: updateError } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Mark as read error:', updateError);
    return error(res, 'Gagal mark as read', 500);
  }

  return success(res, updatedNotification, 'Notification berhasil ditandai telah dibaca');
});
