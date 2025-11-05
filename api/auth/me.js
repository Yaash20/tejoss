// Auth: Get current user profile
const { supabase } = require('../../lib/supabase');
const { protect } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  // Only allow GET
  if (req.method !== 'GET') {
    return error(res, 'Method not allowed', 405);
  }

  // Verify authentication
  const user = await protect(req);

  // Get user details from database
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('id, name, email, phone, role, avatar_url, is_verified, created_at')
    .eq('id', user.id)
    .single();

  if (fetchError) {
    return error(res, 'Gagal mengambil data user', 500);
  }

  return success(res, userData);
});
