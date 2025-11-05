// Auth: Change password
const { supabase } = require('../../lib/supabase');
const { protect, hashPassword, comparePassword } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  // Only allow PUT/PATCH
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return error(res, 'Method not allowed', 405);
  }

  // Verify authentication
  const user = await protect(req);

  const { currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    return error(res, 'Current password dan new password wajib diisi', 400);
  }

  if (newPassword.length < 8) {
    return error(res, 'Password baru minimal 8 karakter', 400);
  }

  // Get user with password
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('password')
    .eq('id', user.id)
    .single();

  if (fetchError) {
    return error(res, 'Gagal mengambil data user', 500);
  }

  // Verify current password
  const isMatch = await comparePassword(currentPassword, userData.password);

  if (!isMatch) {
    return error(res, 'Password lama tidak sesuai', 400);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  const { error: updateError } = await supabase
    .from('users')
    .update({
      password: hashedPassword,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('Update password error:', updateError);
    return error(res, 'Gagal update password', 500);
  }

  return success(res, null, 'Password berhasil diubah');
});
