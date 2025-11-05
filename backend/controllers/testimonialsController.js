const { query, transaction } = require('../config/database');

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = async (req, res, next) => {
  try {
    // Support both 'comment' and 'message' field names
    const { order_id, rating, comment, message, service_name } = req.body;
    const testimonialMessage = comment || message;
    const user_id = req.user.id;

    // DEBUG: Log received data
    console.log('=== CREATE TESTIMONIAL DEBUG ===');
    console.log('Received order_id:', order_id, 'Type:', typeof order_id);
    console.log('User ID:', user_id);
    console.log('Rating:', rating);
    console.log('Message:', testimonialMessage?.substring(0, 50) + '...');
    console.log('Service Name:', service_name);

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating harus antara 1-5'
      });
    }

    if (!testimonialMessage || testimonialMessage.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Testimoni minimal 10 karakter'
      });
    }

    // If order_id is provided, verify it belongs to user (allow any status)
    if (order_id && order_id !== 'null' && order_id !== 'undefined') {
      // Convert to integer if it's a string
      const orderIdInt = typeof order_id === 'string' ? parseInt(order_id, 10) : order_id;
      
      console.log('Parsed order_id to:', orderIdInt, 'Type:', typeof orderIdInt);
      
      // Skip validation if order_id is invalid
      if (isNaN(orderIdInt)) {
        console.warn('Invalid order_id received:', order_id);
      } else {
        console.log('Querying order with id:', orderIdInt, 'and user_id:', user_id);
        
        const orderResult = await query(
          `SELECT * FROM orders 
           WHERE id = $1 AND user_id = $2`,
          [orderIdInt, user_id]
        );

        console.log('Order query result:', orderResult.rows.length, 'rows found');
        
        if (orderResult.rows.length === 0) {
          // DEBUG: Check if order exists at all
          const orderExistsResult = await query(
            `SELECT id, user_id FROM orders WHERE id = $1`,
            [orderIdInt]
          );
          
          if (orderExistsResult.rows.length > 0) {
            console.log('Order exists but belongs to user_id:', orderExistsResult.rows[0].user_id);
            console.log('Current user_id:', user_id);
          } else {
            console.log('Order does not exist in database');
          }
          
          return res.status(400).json({
            success: false,
            message: 'Pesanan tidak ditemukan atau bukan milik Anda'
          });
        }

        // Check if testimonial already exists for this order
        const existingResult = await query(
          'SELECT id FROM testimonials WHERE order_id = $1',
          [orderIdInt]
        );

        if (existingResult.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Testimoni untuk pesanan ini sudah ada'
          });
        }
      }
    }

    // Create testimonial
    // If order_id is provided, use it; otherwise create general testimonial
    let result;
    const orderIdInt = order_id && order_id !== 'null' && order_id !== 'undefined' 
      ? (typeof order_id === 'string' ? parseInt(order_id, 10) : order_id)
      : null;
    
    if (orderIdInt && !isNaN(orderIdInt)) {
      result = await query(
        `INSERT INTO testimonials (user_id, order_id, rating, comment, is_approved) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [user_id, orderIdInt, rating, testimonialMessage, false]
      );
    } else {
      // General testimonial without order_id - store service_name in comment as prefix
      const commentWithService = service_name 
        ? `[${service_name}] ${testimonialMessage}` 
        : testimonialMessage;
      
      result = await query(
        `INSERT INTO testimonials (user_id, rating, comment, is_approved) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [user_id, rating, commentWithService, false]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Testimoni berhasil dibuat, menunggu persetujuan admin',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res, next) => {
  try {
    const { featured, limit = 50 } = req.query;

    let queryText = `
      SELECT t.*, u.name as user_name, u.avatar_url 
      FROM testimonials t
      JOIN users u ON t.user_id = u.id
      WHERE t.is_approved = true
    `;

    if (featured === 'true') {
      queryText += ' AND t.is_featured = true';
    }

    queryText += ' ORDER BY t.created_at DESC LIMIT $1';

    const result = await query(queryText, [limit]);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's testimonials
// @route   GET /api/testimonials/my-testimonials
// @access  Private
exports.getMyTestimonials = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await query(
      `SELECT t.*, o.order_number, o.service_name 
       FROM testimonials t
       JOIN orders o ON t.order_id = o.id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC`,
      [user_id]
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

// @desc    Get testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT t.*, 
              t.comment as message,
              CASE 
                WHEN t.is_approved = true THEN 'approved'
                WHEN t.is_approved = false THEN 'pending'
                ELSE 'pending'
              END as status,
              u.name as user_name, 
              u.email as user_email,
              u.avatar_url, 
              o.order_number, 
              o.service_name
       FROM testimonials t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN orders o ON t.order_id = o.id
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
exports.updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    const result = await query(
      `UPDATE testimonials 
       SET rating = COALESCE($1, rating),
           comment = COALESCE($2, comment),
           is_approved = false
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [rating, comment, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimoni berhasil diupdate, menunggu persetujuan admin',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await query(
      'DELETE FROM testimonials WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimoni berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve testimonial (Admin)
// @route   PUT /api/testimonials/:id/approve
// @access  Private/Admin
exports.approveTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_approved, is_featured, status } = req.body;

    // Support both is_approved (boolean) and status (string: 'approved', 'rejected', 'pending')
    let approvalValue = is_approved;
    
    if (status) {
      approvalValue = status === 'approved';
    }

    const result = await query(
      `UPDATE testimonials 
       SET is_approved = $1,
           is_featured = COALESCE($2, is_featured)
       WHERE id = $3
       RETURNING *`,
      [approvalValue, is_featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: approvalValue ? 'Testimoni berhasil disetujui' : 'Testimoni ditolak',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all testimonials (Admin - including pending)
// @route   GET /api/testimonials/admin/all
// @access  Private/Admin
exports.getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT t.*, 
              t.comment as message,
              CASE 
                WHEN t.is_approved = true THEN 'approved'
                WHEN t.is_approved = false THEN 'pending'
                ELSE 'pending'
              END as status,
              u.name as user_name, 
              u.email as user_email, 
              o.order_number, 
              o.service_name
       FROM testimonials t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN orders o ON t.order_id = o.id
       ORDER BY t.created_at DESC`
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

// @desc    Get testimonial statistics
// @route   GET /api/testimonials/stats/summary
// @access  Public
exports.getTestimonialStats = async (req, res, next) => {
  try {
    // Get average rating
    const avgResult = await query(
      `SELECT 
         COALESCE(AVG(rating), 0) as average_rating,
         COUNT(*) as total_reviews
       FROM testimonials 
       WHERE is_approved = true`
    );

    // Get rating distribution
    const distResult = await query(
      `SELECT rating, COUNT(*) as count
       FROM testimonials
       WHERE is_approved = true
       GROUP BY rating
       ORDER BY rating DESC`
    );

    res.status(200).json({
      success: true,
      data: {
        averageRating: parseFloat(avgResult.rows[0].average_rating).toFixed(1),
        totalReviews: parseInt(avgResult.rows[0].total_reviews),
        distribution: distResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};
