const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticle,
  getPopularArticles,
  getArticlesByCategory,
  getRelatedArticles,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articlesController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllArticles);
router.get('/popular/top', getPopularArticles);
router.get('/category/:category', getArticlesByCategory);
router.get('/:slug', getArticle);
router.get('/:id/related', getRelatedArticles);

// Admin routes
router.post('/', protect, authorize('admin'), createArticle);
router.put('/:id', protect, authorize('admin'), updateArticle);
router.delete('/:id', protect, authorize('admin'), deleteArticle);

module.exports = router;
