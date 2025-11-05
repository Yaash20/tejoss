// Validation Helpers for Vercel Serverless
const { body, validationResult } = require('express-validator');

/**
 * Validate request and return errors if any
 */
const validate = (req) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    
    return {
      isValid: false,
      errors: formattedErrors
    };
  }
  
  return {
    isValid: true,
    errors: []
  };
};

/**
 * Manual validation helpers
 */
const validators = {
  // Email validation
  isEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Password validation (min 8 chars)
  isStrongPassword: (password) => {
    return password && password.length >= 8;
  },
  
  // Phone validation (Indonesia format)
  isPhone: (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone);
  },
  
  // Required field
  isRequired: (value) => {
    return value !== undefined && value !== null && value !== '';
  },
  
  // Numeric validation
  isNumeric: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  
  // Min length
  minLength: (value, min) => {
    return value && value.length >= min;
  },
  
  // Max length
  maxLength: (value, max) => {
    return value && value.length <= max;
  },
  
  // In array
  isIn: (value, allowedValues) => {
    return allowedValues.includes(value);
  }
};

/**
 * Validation rules untuk berbagai endpoints
 */
const validationRules = {
  // Auth
  register: [
    { field: 'name', validator: 'isRequired', message: 'Nama wajib diisi' },
    { field: 'name', validator: 'minLength', value: 2, message: 'Nama minimal 2 karakter' },
    { field: 'email', validator: 'isRequired', message: 'Email wajib diisi' },
    { field: 'email', validator: 'isEmail', message: 'Format email tidak valid' },
    { field: 'password', validator: 'isRequired', message: 'Password wajib diisi' },
    { field: 'password', validator: 'isStrongPassword', message: 'Password minimal 8 karakter' }
  ],
  
  login: [
    { field: 'email', validator: 'isRequired', message: 'Email wajib diisi' },
    { field: 'email', validator: 'isEmail', message: 'Format email tidak valid' },
    { field: 'password', validator: 'isRequired', message: 'Password wajib diisi' }
  ],
  
  // Order
  createOrder: [
    { field: 'service_id', validator: 'isRequired', message: 'Service ID wajib diisi' },
    { field: 'service_id', validator: 'isNumeric', message: 'Service ID harus berupa angka' },
    { field: 'quantity', validator: 'isRequired', message: 'Quantity wajib diisi' },
    { field: 'quantity', validator: 'isNumeric', message: 'Quantity harus berupa angka' },
    { field: 'location', validator: 'isRequired', message: 'Lokasi wajib diisi' },
    { field: 'schedule_date', validator: 'isRequired', message: 'Tanggal jadwal wajib diisi' }
  ],
  
  // Testimonial
  createTestimonial: [
    { field: 'rating', validator: 'isRequired', message: 'Rating wajib diisi' },
    { field: 'rating', validator: 'isNumeric', message: 'Rating harus berupa angka' }
    // comment/message is optional
  ],
  
  // B2B
  createB2B: [
    { field: 'company_name', validator: 'isRequired', message: 'Nama perusahaan wajib diisi' },
    { field: 'email', validator: 'isRequired', message: 'Email wajib diisi' },
    { field: 'email', validator: 'isEmail', message: 'Format email tidak valid' },
    { field: 'phone', validator: 'isRequired', message: 'Nomor telepon wajib diisi' }
  ]
};

/**
 * Validate request body based on rules
 */
const validateRequest = (body, rules) => {
  const errors = [];
  
  for (const rule of rules) {
    const { field, validator, value, message } = rule;
    const fieldValue = body[field];
    
    let isValid = false;
    
    if (validator === 'minLength') {
      isValid = validators.minLength(fieldValue, value);
    } else if (validator === 'maxLength') {
      isValid = validators.maxLength(fieldValue, value);
    } else if (validator === 'isIn') {
      isValid = validators.isIn(fieldValue, value);
    } else {
      isValid = validators[validator] ? validators[validator](fieldValue) : true;
    }
    
    if (!isValid) {
      errors.push({
        field,
        message
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validate,
  validators,
  validationRules,
  validateRequest
};
