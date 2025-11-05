const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await query(
      `INSERT INTO users (name, email, password, phone, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, phone, role, created_at`,
      [name, email, hashedPassword, phone || null, 'customer']
    );

    const user = result.rows[0];

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get user from database
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Update last login
    await query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar_url: user.avatar_url
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, phone, role, avatar_url, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    // Get user statistics
    const statsResult = await query(
      `SELECT 
        (SELECT COUNT(*) FROM orders WHERE user_id = $1) as total_orders,
        (SELECT COUNT(*) FROM testimonials WHERE user_id = $1) as total_testimonials
      `,
      [req.user.id]
    );

    const userData = result.rows[0];
    const stats = statsResult.rows[0];

    res.status(200).json({
      success: true,
      data: {
        ...userData,
        stats: {
          total_orders: parseInt(stats.total_orders) || 0,
          total_testimonials: parseInt(stats.total_testimonials) || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           phone = COALESCE($2, phone),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, name, email, phone, role, avatar_url`,
      [name, phone, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current user with password
    const result = await query(
      'SELECT password FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Password lama tidak sesuai'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Password berhasil diubah'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, email, phone, role, is_verified, created_at, updated_at,
              (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as total_orders,
              (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE user_id = users.id AND payment_status = 'paid') as total_spent
       FROM users 
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user details with orders (Admin only)
// @route   GET /api/auth/admin/users/:id
// @access  Private/Admin
exports.getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get user info
    const userResult = await query(
      'SELECT id, name, email, phone, role, is_verified, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Get user's orders
    const ordersResult = await query(
      `SELECT order_number, service_name, total_price, status, payment_status, created_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        user: userResult.rows[0],
        orders: ordersResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};
