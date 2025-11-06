// Notifications API - Placeholder
const { protect } = require('../lib/auth');
const { success, error, asyncHandler, setCorsHeaders } = require('../lib/response');
const { supabase } = require('../lib/supabase');

export default asyncHandler(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id, action } = req.query;
  
  // GET /api/notifications
  if (req.method === 'GET' && !id) {
    const user = await protect(req);
    
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    return success(res, notifications || []);
  }
  
  // PUT /api/notifications?id=123&action=read
  if (req.method === 'PUT' && id && action === 'read') {
    const user = await protect(req);
    
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', user.id);
    
    return success(res, null, 'Notifikasi ditandai sudah dibaca');
  }
  
  return error(res, 'Method not allowed', 405);
});
