// Services: Get/Update/Delete single service
const { supabase } = require('../../lib/supabase');
const { protect, authorize } = require('../../lib/auth');
const { success, error, notFound, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return error(res, 'Service ID diperlukan', 400);
  }

  if (req.method === 'GET') {
    return await getService(req, res, id);
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    return await updateService(req, res, id);
  } else if (req.method === 'DELETE') {
    return await deleteService(req, res, id);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET single service
async function getService(req, res, id) {
  const { data: service, error: fetchError } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (fetchError || !service) {
    return notFound(res, 'Service tidak ditemukan');
  }

  return success(res, service);
}

// UPDATE service (Admin only)
async function updateService(req, res, id) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { name, category, description, price, unit, image_url, features, is_active } = req.body;

  // Build update object
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (category !== undefined) updateData.category = category;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (unit !== undefined) updateData.unit = unit;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (features !== undefined) updateData.features = features;
  if (is_active !== undefined) updateData.is_active = is_active;
  updateData.updated_at = new Date().toISOString();

  // Update service
  const { data: service, error: updateError } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Update service error:', updateError);
    return error(res, 'Gagal update service', 500);
  }

  return success(res, service, 'Service berhasil diupdate');
}

// DELETE service (Admin only - soft delete)
async function deleteService(req, res, id) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  // Soft delete by setting is_active to false
  const { error: deleteError } = await supabase
    .from('services')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (deleteError) {
    console.error('Delete service error:', deleteError);
    return error(res, 'Gagal delete service', 500);
  }

  return success(res, null, 'Service berhasil dihapus');
}
