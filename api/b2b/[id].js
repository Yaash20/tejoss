// B2B: Update partnership status (Admin only)
const { supabase } = require('../../lib/supabase');
const { protect, authorize } = require('../../lib/auth');
const { success, error, notFound, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return error(res, 'Partnership ID diperlukan', 400);
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    return await updatePartnership(req, res, id);
  } else if (req.method === 'DELETE') {
    return await deletePartnership(req, res, id);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// UPDATE partnership status
async function updatePartnership(req, res, id) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { status } = req.body;

  if (!status) {
    return error(res, 'Status wajib diisi', 400);
  }

  const allowedStatuses = ['pending', 'approved', 'rejected'];
  if (!allowedStatuses.includes(status)) {
    return error(res, 'Status tidak valid', 400);
  }

  const { data: partnership, error: updateError } = await supabase
    .from('b2b_partnerships')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Update partnership error:', updateError);
    return error(res, 'Gagal update partnership', 500);
  }

  return success(res, partnership, 'Partnership status berhasil diupdate');
}

// DELETE partnership
async function deletePartnership(req, res, id) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { error: deleteError } = await supabase
    .from('b2b_partnerships')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Delete partnership error:', deleteError);
    return error(res, 'Gagal delete partnership', 500);
  }

  return success(res, null, 'Partnership berhasil dihapus');
}
