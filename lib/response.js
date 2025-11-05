// Response Helpers for Vercel Serverless

/**
 * Success response
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Error response
 */
const error = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Validation error response
 */
const validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors
  });
};

/**
 * Unauthorized response
 */
const unauthorized = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    message
  });
};

/**
 * Forbidden response
 */
const forbidden = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    message
  });
};

/**
 * Not found response
 */
const notFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};

/**
 * Handle async errors in serverless functions
 */
const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      console.error('Async handler error:', err);
      
      // Handle specific error types
      if (err.message === 'No token provided' || err.message === 'User not found') {
        return unauthorized(res, err.message);
      }
      
      if (err.message && err.message.includes('not authorized')) {
        return forbidden(res, err.message);
      }
      
      if (err.message && err.message.includes('not found')) {
        return notFound(res, err.message);
      }
      
      // Generic error
      return error(res, err.message || 'Internal server error', 500);
    }
  };
};

/**
 * CORS headers helper
 */
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
};

module.exports = {
  success,
  error,
  validationError,
  unauthorized,
  forbidden,
  notFound,
  asyncHandler,
  setCorsHeaders
};
