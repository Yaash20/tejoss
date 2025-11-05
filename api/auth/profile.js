// Auth: Update profile
const { supabase } = require('../../lib/supabase');
const { protect } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  // Only allow PUT/PATCH
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return error(res, 'Method not allowed', 405);
  }

  // Verify authentication
  const user = await protect(req);

  const { name, phone } = req.body;

  // Build update object
  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  updateData.updated_at = new Date().toISOString();

  // Update user
  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id)
    .select('id, name, email, phone, role, avatar_url')
    .single();

  if (updateError) {
    console.error('Update profile error:', updateError);
    return error(res, 'Gagal update profile', 500);
  }

  return success(res, updatedUser, 'Profile berhasil diupdate');
});
