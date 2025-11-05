const { query } = require('../config/database');

// @desc    Submit B2B partnership request
// @route   POST /api/b2b
// @access  Public
exports.submitPartnership = async (req, res, next) => {
  try {
    const { company_name, contact_person, email, phone, company_type, description } = req.body;

    // Check if company already submitted
    const existingResult = await query(
      'SELECT id FROM b2b_partnerships WHERE email = $1',
      [email]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Perusahaan dengan email ini sudah pernah mendaftar'
      });
    }

    const result = await query(
      `INSERT INTO b2b_partnerships 
       (company_name, contact_person, email, phone, company_type, description, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [company_name, contact_person, email, phone, company_type, description, 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Pengajuan kemitraan berhasil dikirim, tim kami akan segera menghubungi Anda',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all partnerships (Admin)
// @route   GET /api/b2b
// @access  Private/Admin
exports.getAllPartnerships = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let queryText = 'SELECT * FROM b2b_partnerships WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      queryText += ` AND (company_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
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

// @desc    Get single partnership
// @route   GET /api/b2b/:id
// @access  Private/Admin
exports.getPartnership = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM b2b_partnerships WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data kemitraan tidak ditemukan'
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

// @desc    Update partnership status (Admin)
// @route   PUT /api/b2b/:id/status
// @access  Private/Admin
exports.updatePartnershipStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'contacted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const result = await query(
      `UPDATE b2b_partnerships 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data kemitraan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status kemitraan berhasil diupdate',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete partnership (Admin)
// @route   DELETE /api/b2b/:id
// @access  Private/Admin
exports.deletePartnership = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM b2b_partnerships WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data kemitraan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data kemitraan berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get partnership statistics (Admin)
// @route   GET /api/b2b/stats/summary
// @access  Private/Admin
exports.getPartnershipStats = async (req, res, next) => {
  try {
    // Get counts by status
    const statusResult = await query(
      `SELECT status, COUNT(*) as count 
       FROM b2b_partnerships 
       GROUP BY status`
    );

    // Get total partnerships
    const totalResult = await query(
      'SELECT COUNT(*) as total FROM b2b_partnerships'
    );

    // Get recent partnerships
    const recentResult = await query(
      `SELECT * FROM b2b_partnerships 
       ORDER BY created_at DESC 
       LIMIT 5`
    );

    res.status(200).json({
      success: true,
      data: {
        total: parseInt(totalResult.rows[0].total),
        statusCounts: statusResult.rows,
        recent: recentResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};
