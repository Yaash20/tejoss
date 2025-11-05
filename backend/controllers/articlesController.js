const { query } = require('../config/database');

// Helper to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getAllArticles = async (req, res, next) => {
  try {
    const { category, search, limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM articles WHERE is_published = true';
    const params = [];
    let paramCount = 1;

    if (category) {
      queryText += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (search) {
      queryText += ` AND (title ILIKE $${paramCount} OR excerpt ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    queryText += ` ORDER BY published_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM articles WHERE is_published = true';
    const countParams = [];
    let countParamIdx = 1;

    if (category) {
      countQuery += ` AND category = $${countParamIdx}`;
      countParams.push(category);
      countParamIdx++;
    }

    if (search) {
      countQuery += ` AND (title ILIKE $${countParamIdx} OR excerpt ILIKE $${countParamIdx} OR content ILIKE $${countParamIdx})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await query(countQuery, countParams);
    const totalArticles = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      total: totalArticles,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalArticles / limit),
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by slug
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticle = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await query(
      'SELECT * FROM articles WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    // Increment views
    await query(
      'UPDATE articles SET views = views + 1 WHERE slug = $1',
      [slug]
    );

    const article = result.rows[0];
    article.views += 1;

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular articles
// @route   GET /api/articles/popular/top
// @access  Public
exports.getPopularArticles = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const result = await query(
      `SELECT * FROM articles 
       WHERE is_published = true 
       ORDER BY views DESC 
       LIMIT $1`,
      [limit]
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

// @desc    Get articles by category
// @route   GET /api/articles/category/:category
// @access  Public
exports.getArticlesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;

    const result = await query(
      `SELECT * FROM articles 
       WHERE category = $1 AND is_published = true 
       ORDER BY published_at DESC 
       LIMIT $2`,
      [category, limit]
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

// @desc    Get related articles
// @route   GET /api/articles/:id/related
// @access  Public
exports.getRelatedArticles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 3 } = req.query;

    // Get current article category
    const articleResult = await query(
      'SELECT category FROM articles WHERE id = $1',
      [id]
    );

    if (articleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    const category = articleResult.rows[0].category;

    // Get related articles from same category
    const result = await query(
      `SELECT * FROM articles 
       WHERE category = $1 AND id != $2 AND is_published = true 
       ORDER BY published_at DESC 
       LIMIT $3`,
      [category, id, limit]
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

// @desc    Create article (Admin)
// @route   POST /api/articles
// @access  Private/Admin
exports.createArticle = async (req, res, next) => {
  try {
    const { title, category, excerpt, content, image_url, author } = req.body;
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingResult = await query(
      'SELECT id FROM articles WHERE slug = $1',
      [slug]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Artikel dengan judul serupa sudah ada'
      });
    }

    const result = await query(
      `INSERT INTO articles (title, slug, category, excerpt, content, image_url, author, published_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [title, slug, category, excerpt, content, image_url, author]
    );

    res.status(201).json({
      success: true,
      message: 'Artikel berhasil dibuat',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article (Admin)
// @route   PUT /api/articles/:id
// @access  Private/Admin
exports.updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, excerpt, content, image_url, author, is_published } = req.body;

    let slug;
    if (title) {
      slug = generateSlug(title);
      
      // Check if new slug conflicts with existing articles
      const existingResult = await query(
        'SELECT id FROM articles WHERE slug = $1 AND id != $2',
        [slug, id]
      );

      if (existingResult.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Artikel dengan judul serupa sudah ada'
        });
      }
    }

    const result = await query(
      `UPDATE articles 
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           category = COALESCE($3, category),
           excerpt = COALESCE($4, excerpt),
           content = COALESCE($5, content),
           image_url = COALESCE($6, image_url),
           author = COALESCE($7, author),
           is_published = COALESCE($8, is_published),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, slug, category, excerpt, content, image_url, author, is_published, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Artikel berhasil diupdate',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article (Admin)
// @route   DELETE /api/articles/:id
// @access  Private/Admin
exports.deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete - set is_published to false
    const result = await query(
      'UPDATE articles SET is_published = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Artikel berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
