// Testimonials: Update/Delete testimonial (Admin only)
const { supabase } = require('../../lib/supabase');
const { protect, authorize } = require('../../lib/auth');
const { success, error, notFound, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return error(res, 'Testimonial ID diperlukan', 400);
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    return await updateTestimonial(req, res, id);
  } else if (req.method === 'DELETE') {
    return await deleteTestimonial(req, res, id);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// UPDATE testimonial (Admin only - approve/feature)
async function updateTestimonial(req, res, id) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { is_approved, is_featured } = req.body;

  const updateData = {};
  if (is_approved !== undefined) updateData.is_approved = is_approved;
  if (is_featured !== undefined) updateData.is_featured = is_featured;

  if (Object.keys(updateData).length === 0) {
    return error(res, 'Tidak ada data untuk diupdate', 400);
  }

  const { data: testimonial, error: updateError } = await supabase
    .from('testimonials')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Update testimonial error:', updateError);
    return error(res, 'Gagal update testimonial', 500);
  }

  return success(res, testimonial, 'Testimonial berhasil diupdate');
}

// DELETE testimonial (Admin only)
async function deleteTestimonial(req, res, id) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { error: deleteError } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Delete testimonial error:', deleteError);
    return error(res, 'Gagal delete testimonial', 500);
  }

  return success(res, null, 'Testimonial berhasil dihapus');
}
