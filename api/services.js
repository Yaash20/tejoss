// Services API - Consolidated
// Handles: GET all, GET by id, POST create, PUT update, DELETE
const { protect, authorize, optionalAuth } = require('../lib/auth');
const { success, error, asyncHandler, setCorsHeaders } = require('../lib/response');
const { supabase } = require('../lib/supabase');

export default asyncHandler(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id } = req.query;
  
  // GET /api/services
  if (req.method === 'GET' && !id) {
    return await handleGetServices(req, res);
  }
  
  // GET /api/services?id=123
  if (req.method === 'GET' && id) {
    return await handleGetService(req, res, id);
  }
  
  // POST /api/services (Admin only)
  if (req.method === 'POST') {
    return await handleCreateService(req, res);
  }
  
  // PUT /api/services?id=123 (Admin only)
  if (req.method === 'PUT' && id) {
    return await handleUpdateService(req, res, id);
  }
  
  // DELETE /api/services?id=123 (Admin only)
  if (req.method === 'DELETE' && id) {
    return await handleDeleteService(req, res, id);
  }
  
  return error(res, 'Invalid method', 405);
});

// Get all services
async function handleGetServices(req, res) {
  const { category, search, all } = req.query;
  
  // Check if admin (optional auth)
  const user = await optionalAuth(req);
  const isAdmin = user?.role === 'admin';
  
  let query = supabase.from('services').select('*');
  
  // Non-admin only sees active services
  if (!isAdmin || all !== 'true') {
    query = query.eq('is_active', true);
  }
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data: services, error: fetchError } = await query;
  
  if (fetchError) {
    console.error('Get services error:', fetchError);
    return error(res, 'Gagal mengambil data layanan', 500);
  }
  
  return success(res, services || []);
}

// Get single service
async function handleGetService(req, res, id) {
  const { data: service, error: fetchError } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
  
  if (fetchError || !service) {
    return error(res, 'Service tidak ditemukan', 404);
  }
  
  return success(res, service);
}

// Create service (Admin only)
async function handleCreateService(req, res) {
  const user = await protect(req);
  authorize(user, 'admin');
  
  const { name, category, description, price, unit, features, image_url } = req.body;
  
  // Validate features
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
  
  const { data: service, error: insertError } = await supabase
    .from('services')
    .insert([{
      name,
      category,
      description: description || '',
      price,
      unit,
      features: validFeatures,
      image_url: image_url || ''
    }])
    .select()
    .single();
  
  if (insertError) {
    console.error('Create service error:', insertError);
    return error(res, 'Gagal membuat service', 500);
  }
  
  return success(res, service, 'Service berhasil dibuat', 201);
}

// Update service (Admin only)
async function handleUpdateService(req, res, id) {
  const user = await protect(req);
  authorize(user, 'admin');
  
  const { name, category, description, price, unit, features, image_url, is_active } = req.body;
  
  // Validate features
  let validFeatures = undefined;
  if (features !== undefined) {
    if (Array.isArray(features)) {
      validFeatures = features;
    } else if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        validFeatures = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        validFeatures = [];
      }
    } else {
      validFeatures = [];
    }
  }
  
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (category !== undefined) updateData.category = category;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (unit !== undefined) updateData.unit = unit;
  if (validFeatures !== undefined) updateData.features = validFeatures;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (is_active !== undefined) updateData.is_active = is_active;
  updateData.updated_at = new Date().toISOString();
  
  const { data: service, error: updateError } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (updateError || !service) {
    return error(res, 'Service tidak ditemukan', 404);
  }
  
  return success(res, service, 'Service berhasil diupdate');
}

// Delete service (Admin only - soft delete)
async function handleDeleteService(req, res, id) {
  const user = await protect(req);
  authorize(user, 'admin');
  
  const { data: service, error: deleteError } = await supabase
    .from('services')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (deleteError || !service) {
    return error(res, 'Service tidak ditemukan', 404);
  }
  
  return success(res, null, 'Service berhasil dihapus');
}
