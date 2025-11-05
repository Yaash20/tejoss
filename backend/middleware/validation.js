const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for registration
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama harus diisi')
    .isLength({ min: 2, max: 255 }).withMessage('Nama harus 2-255 karakter'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email harus diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password harus diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Format nomor telepon tidak valid')
];

// Validation rules for login
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email harus diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password harus diisi')
];

// Validation rules for order creation
exports.validateOrder = [
  body('service_id')
    .notEmpty().withMessage('Service ID harus diisi')
    .isInt().withMessage('Service ID harus berupa angka'),
  body('quantity')
    .notEmpty().withMessage('Kuantitas harus diisi')
    .isFloat({ min: 0.1 }).withMessage('Kuantitas harus lebih dari 0'),
  body('location')
    .trim()
    .notEmpty().withMessage('Lokasi harus diisi'),
  body('schedule_date')
    .notEmpty().withMessage('Tanggal harus diisi')
    .isDate().withMessage('Format tanggal tidak valid')
];

// Validation rules for testimonial
exports.validateTestimonial = [
  body('order_id')
    .optional({ nullable: true })
    .isInt().withMessage('Order ID harus berupa angka'),
  body('rating')
    .notEmpty().withMessage('Rating harus diisi')
    .isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1-5'),
  body('comment')
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Komentar harus 10-1000 karakter'),
  body('message')
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Pesan harus 10-1000 karakter'),
  // Custom validator to ensure either 'comment' or 'message' exists
  body().custom((value, { req }) => {
    const comment = req.body.comment;
    const message = req.body.message;
    
    if (!comment && !message) {
      throw new Error('Testimoni/komentar harus diisi');
    }
    
    const text = comment || message;
    if (text.trim().length < 10) {
      throw new Error('Testimoni minimal 10 karakter');
    }
    
    return true;
  })
];

// Validation rules for B2B partnership
exports.validateB2B = [
  body('company_name')
    .trim()
    .notEmpty().withMessage('Nama perusahaan harus diisi'),
  body('contact_person')
    .trim()
    .notEmpty().withMessage('Nama kontak person harus diisi'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email harus diisi')
    .isEmail().withMessage('Format email tidak valid'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Nomor telepon harus diisi'),
  body('company_type')
    .trim()
    .notEmpty().withMessage('Tipe perusahaan harus diisi')
];
