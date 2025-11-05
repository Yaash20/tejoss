// Notifications: Get all & Mark as read
const { supabase } = require('../../lib/supabase');
const { protect } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  if (req.method === 'GET') {
    return await getNotifications(req, res);
  } else if (req.method === 'POST') {
    return await markAllAsRead(req, res);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET all notifications for user
async function getNotifications(req, res) {
  // Verify authentication
  const user = await protect(req);
  
  const { is_read, limit } = req.query;

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id);

  // Filter by is_read
  if (is_read !== undefined) {
    query = query.eq('is_read', is_read === 'true');
  }

  // Limit results
  if (limit) {
    query = query.limit(parseInt(limit));
  }

  query = query.order('created_at', { ascending: false });

  const { data: notifications, error: fetchError } = await query;

  if (fetchError) {
    console.error('Get notifications error:', fetchError);
    return error(res, 'Gagal mengambil data notifications', 500);
  }

  // Get unread count
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  return success(res, {
    count: notifications.length,
    unread_count: unreadCount || 0,
    notifications
  });
}

// POST mark all notifications as read
async function markAllAsRead(req, res) {
  // Verify authentication
  const user = await protect(req);

  const { error: updateError } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (updateError) {
    console.error('Mark all as read error:', updateError);
    return error(res, 'Gagal mark all as read', 500);
  }

  return success(res, null, 'Semua notifikasi telah dibaca');
}
