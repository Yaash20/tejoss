// Articles: Get/Update/Delete single article
const { supabase } = require('../../lib/supabase');
const { protect, authorize } = require('../../lib/auth');
const { success, error, notFound, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return error(res, 'Article ID diperlukan', 400);
  }

  if (req.method === 'GET') {
    return await getArticle(req, res, id);
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    return await updateArticle(req, res, id);
  } else if (req.method === 'DELETE') {
    return await deleteArticle(req, res, id);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET single article (increment views)
async function getArticle(req, res, id) {
  const { data: article, error: fetchError } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (fetchError || !article) {
    return notFound(res, 'Article tidak ditemukan');
  }

  // Increment views
  await supabase
    .from('articles')
    .update({ views: (article.views || 0) + 1 })
    .eq('id', id);

  return success(res, article);
}

// UPDATE article (Admin only)
async function updateArticle(req, res, id) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { title, category, excerpt, content, image_url, author, is_published } = req.body;

  const updateData = {};
  if (title !== undefined) {
    updateData.title = title;
    // Regenerate slug if title changed
    updateData.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (category !== undefined) updateData.category = category;
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (content !== undefined) updateData.content = content;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (author !== undefined) updateData.author = author;
  if (is_published !== undefined) updateData.is_published = is_published;
  updateData.updated_at = new Date().toISOString();

  const { data: article, error: updateError } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Update article error:', updateError);
    return error(res, 'Gagal update article', 500);
  }

  return success(res, article, 'Article berhasil diupdate');
}

// DELETE article (Admin only)
async function deleteArticle(req, res, id) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { error: deleteError } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Delete article error:', deleteError);
    return error(res, 'Gagal delete article', 500);
  }

  return success(res, null, 'Article berhasil dihapus');
}
