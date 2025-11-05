const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const testimonialsRoutes = require('./routes/testimonialsRoutes');
const articlesRoutes = require('./routes/articlesRoutes');
const b2bRoutes = require('./routes/b2bRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');

// Initialize app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or file://)
    if (!origin) return callback(null, true);
    
    // Allow localhost in any port for development
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL
    ];
    
    // Allow file:// protocol for local HTML files
    if (origin.startsWith('file://') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow localhost with any port in development
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Terlalu banyak request dari IP ini, silakan coba lagi nanti',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/b2b', b2bRoutes);
app.use('/api/notifications', notificationsRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Tejoss API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      services: '/api/services',
      orders: '/api/orders',
      payments: '/api/payments',
      testimonials: '/api/testimonials',
      articles: '/api/articles',
      b2b: '/api/b2b',
      notifications: '/api/notifications'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n🚀 ═══════════════════════════════════════════════════════');
  console.log(`   Tejoss Backend API Server`);
  console.log('   ═══════════════════════════════════════════════════════');
  console.log(`   📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   🌐 Server running on: http://localhost:${PORT}`);
  console.log(`   📊 Health check: http://localhost:${PORT}/health`);
  console.log(`   📚 API Base URL: http://localhost:${PORT}/api`);
  console.log('   ═══════════════════════════════════════════════════════\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
