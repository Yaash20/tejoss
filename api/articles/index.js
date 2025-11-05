// Articles: Get all articles & Create article
const { supabase } = require('../../lib/supabase');
const { protect, authorize, optionalAuth } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  if (req.method === 'GET') {
    return await getArticles(req, res);
  } else if (req.method === 'POST') {
    return await createArticle(req, res);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET all articles
async function getArticles(req, res) {
  const { category, search, limit } = req.query;

  let query = supabase
    .from('articles')
    .select('*')
    .eq('is_published', true);

  // Filter by category
  if (category) {
    query = query.eq('category', category);
  }

  // Search by title or excerpt
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  // Limit results
  if (limit) {
    query = query.limit(parseInt(limit));
  }

  query = query.order('published_at', { ascending: false });

  const { data: articles, error: fetchError } = await query;

  if (fetchError) {
    console.error('Get articles error:', fetchError);
    return error(res, 'Gagal mengambil data articles', 500);
  }

  return success(res, {
    count: articles.length,
    articles
  });
}

// POST create article (Admin only)
async function createArticle(req, res) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { title, category, excerpt, content, image_url, author } = req.body;

  // Validation
  if (!title || !content) {
    return error(res, 'Title dan content wajib diisi', 400);
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Create article
  const { data: article, error: createError } = await supabase
    .from('articles')
    .insert([
      {
        title,
        slug,
        category: category || 'Umum',
        excerpt,
        content,
        image_url,
        author: author || user.name,
        is_published: true,
        published_at: new Date().toISOString(),
        views: 0
      }
    ])
    .select()
    .single();

  if (createError) {
    console.error('Create article error:', createError);
    return error(res, 'Gagal membuat article', 500);
  }

  return success(res, article, 'Article berhasil dibuat', 201);
}
