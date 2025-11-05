const { query } = require('../config/database');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getAllServices = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    
    let queryText = 'SELECT * FROM services WHERE is_active = true';
    const params = [];
    let paramCount = 1;

    // Filter by category
    if (category) {
      queryText += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Search by name or description
    if (search) {
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services including inactive (Admin only)
// @route   GET /api/services/admin/all
// @access  Private/Admin
exports.getAllServicesAdmin = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM services ORDER BY created_at DESC'
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

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM services WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service tidak ditemukan'
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

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
exports.getServicesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const result = await query(
      'SELECT * FROM services WHERE category = $1 AND is_active = true ORDER BY created_at DESC',
      [category]
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

// @desc    Create service (Admin only)
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res, next) => {
  try {
    const { name, category, description, price, unit, features, image_url } = req.body;

    // Ensure features is a valid JSON array
    let validFeatures = [];
    if (features) {
      if (Array.isArray(features)) {
        validFeatures = features;
      } else if (typeof features === 'string') {
        try {
          const parsed = JSON.parse(features);
          validFeatures = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          validFeatures = [];
        }
      }
    }

    const result = await query(
      `INSERT INTO services (name, category, description, price, unit, features, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, category, description || '', price, unit, JSON.stringify(validFeatures), image_url || '']
    );

    res.status(201).json({
      success: true,
      message: 'Service berhasil dibuat',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service (Admin only)
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, unit, features, image_url, is_active } = req.body;

    // Ensure features is a valid JSON array
    let validFeatures = null;
    if (features !== undefined) {
      if (Array.isArray(features)) {
        validFeatures = JSON.stringify(features);
      } else if (typeof features === 'string') {
        try {
          const parsed = JSON.parse(features);
          validFeatures = JSON.stringify(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          validFeatures = JSON.stringify([]);
        }
      } else {
        validFeatures = JSON.stringify([]);
      }
    }

    const result = await query(
      `UPDATE services 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           unit = COALESCE($5, unit),
           features = COALESCE($6, features),
           image_url = COALESCE($7, image_url),
           is_active = COALESCE($8, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, category, description, price, unit, validFeatures, image_url, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service berhasil diupdate',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service (Admin only)
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete - set is_active to false
    const result = await query(
      'UPDATE services SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
