// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Server Error',
    statusCode: err.statusCode || 500
  };

  // PostgreSQL duplicate key error
  if (err.code === '23505') {
    error.message = 'Data sudah ada dalam database';
    error.statusCode = 400;
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    error.message = 'Data terkait tidak ditemukan';
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Token tidak valid';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token sudah expired';
    error.statusCode = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation error';
    error.statusCode = 400;
  }

  // Send response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
