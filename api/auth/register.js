// Auth: Register endpoint
const { supabase } = require('../../lib/supabase');
const { hashPassword, generateToken } = require('../../lib/auth');
const { success, error, validationError, asyncHandler } = require('../../lib/response');
const { validateRequest, validationRules } = require('../../lib/validation');

module.exports = asyncHandler(async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return error(res, 'Method not allowed', 405);
  }

  const { name, email, password, phone } = req.body;

  // Validate request
  const validation = validateRequest(req.body, validationRules.register);
  if (!validation.isValid) {
    return validationError(res, validation.errors);
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return error(res, 'Email sudah terdaftar', 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const { data: user, error: createError } = await supabase
    .from('users')
    .insert([
      {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'customer'
      }
    ])
    .select('id, name, email, phone, role, created_at')
    .single();

  if (createError) {
    console.error('Create user error:', createError);
    return error(res, 'Gagal membuat user', 500);
  }

  // Generate token
  const token = generateToken(user.id);

  return success(
    res,
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    },
    'Registrasi berhasil',
    201
  );
});
