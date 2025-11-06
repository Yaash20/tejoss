// Authentication API - Consolidated
// Handles: login, register, me, profile, change-password
const { protect, generateToken, hashPassword, comparePassword } = require('../lib/auth');
const { success, error, asyncHandler, setCorsHeaders } = require('../lib/response');
const { supabase } = require('../lib/supabase');

export default asyncHandler(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { action } = req.query;
  
  // POST /api/auth?action=register
  if (req.method === 'POST' && action === 'register') {
    return await handleRegister(req, res);
  }
  
  // POST /api/auth?action=login
  if (req.method === 'POST' && action === 'login') {
    return await handleLogin(req, res);
  }
  
  // GET /api/auth?action=me
  if (req.method === 'GET' && action === 'me') {
    return await handleGetMe(req, res);
  }
  
  // PUT /api/auth?action=profile
  if (req.method === 'PUT' && action === 'profile') {
    return await handleUpdateProfile(req, res);
  }
  
  // PUT /api/auth?action=change-password
  if (req.method === 'PUT' && action === 'change-password') {
    return await handleChangePassword(req, res);
  }
  
  return error(res, 'Invalid action or method', 400);
});

// Register handler
async function handleRegister(req, res) {
  const { name, email, password, phone } = req.body;
  
  // Check if user exists
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
  const { data: user, error: insertError } = await supabase
    .from('users')
    .insert([{
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: 'customer'
    }])
    .select('id, name, email, phone, role, created_at')
    .single();
  
  if (insertError) {
    console.error('Register error:', insertError);
    return error(res, 'Gagal membuat akun', 500);
  }
  
  // Generate token
  const token = generateToken(user.id);
  
  return success(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  }, 'Registrasi berhasil', 201);
}

// Login handler
async function handleLogin(req, res) {
  const { email, password } = req.body;
  
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
}

// Get Me handler
async function handleGetMe(req, res) {
  const user = await protect(req);
  
  // Get user statistics
  const { data: orders } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', user.id);
  
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id')
    .eq('user_id', user.id);
  
  return success(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar_url: user.avatar_url,
    stats: {
      total_orders: orders?.length || 0,
      total_testimonials: testimonials?.length || 0
    }
  });
}

// Update Profile handler
async function handleUpdateProfile(req, res) {
  const user = await protect(req);
  const { name, phone } = req.body;
  
  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  updateData.updated_at = new Date().toISOString();
  
  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id)
    .select('id, name, email, phone, role, avatar_url')
    .single();
  
  if (updateError) {
    return error(res, 'Gagal update profile', 500);
  }
  
  return success(res, updatedUser, 'Profile berhasil diupdate');
}

// Change Password handler
async function handleChangePassword(req, res) {
  const user = await protect(req);
  const { currentPassword, newPassword } = req.body;
  
  // Get current user with password
  const { data: userData } = await supabase
    .from('users')
    .select('password')
    .eq('id', user.id)
    .single();
  
  // Verify current password
  const isMatch = await comparePassword(currentPassword, userData.password);
  
  if (!isMatch) {
    return error(res, 'Password lama tidak sesuai', 400);
  }
  
  // Hash new password
  const hashedPassword = await hashPassword(newPassword);
  
  // Update password
  await supabase
    .from('users')
    .update({ 
      password: hashedPassword,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);
  
  return success(res, null, 'Password berhasil diubah');
}
