// Auth: Login endpoint
const { supabase } = require('../../lib/supabase');
const { comparePassword, generateToken } = require('../../lib/auth');
const { success, error, validationError, asyncHandler } = require('../../lib/response');
const { validateRequest, validationRules } = require('../../lib/validation');

module.exports = asyncHandler(async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return error(res, 'Method not allowed', 405);
  }

  const { email, password } = req.body;

  // Validate request
  const validation = validateRequest(req.body, validationRules.login);
  if (!validation.isValid) {
    return validationError(res, validation.errors);
  }

  // Get user from database
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (fetchError || !user) {
    return error(res, 'Email atau password salah', 401);
  }

  // Check password
  const isPasswordMatch = await comparePassword(password, user.password);

  if (!isPasswordMatch) {
    return error(res, 'Email atau password salah', 401);
  }

  // Generate token
  const token = generateToken(user.id);

  // Update last login
  await supabase
    .from('users')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', user.id);

  return success(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url
    },
    token
  }, 'Login berhasil');
});
