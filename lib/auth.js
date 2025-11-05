// Authentication Helpers for Vercel Serverless
const jwt = require('jsonwebtoken');
const { supabase } = require('./supabase');

/**
 * Verify JWT token and get user
 */
const verifyToken = async (token) => {
  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, avatar_url')
      .eq('id', decoded.id)
      .single();
    
    if (error || !user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Extract token from request headers
 */
const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};

/**
 * Protect middleware - Require authentication
 */
const protect = async (req) => {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  const user = await verifyToken(token);
  return user;
};

/**
 * Authorize middleware - Check user role
 */
const authorize = (user, ...allowedRoles) => {
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Role ${user.role} is not authorized`);
  }
  return true;
};

/**
 * Optional auth - Get user if token exists
 */
const optionalAuth = async (req) => {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return null;
    }
    
    const user = await verifyToken(token);
    return user;
  } catch (error) {
    // Token invalid, but continue without user
    return null;
  }
};

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Hash password
 */
const hashPassword = async (password) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password
 */
const comparePassword = async (enteredPassword, hashedPassword) => {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  verifyToken,
  getTokenFromRequest,
  generateToken,
  hashPassword,
  comparePassword
};
