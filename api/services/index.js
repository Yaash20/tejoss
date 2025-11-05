// Services: Get all services
const { supabase } = require('../../lib/supabase');
const { optionalAuth } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  // Only allow GET and POST
  if (req.method === 'GET') {
    return await getAllServices(req, res);
  } else if (req.method === 'POST') {
    return await createService(req, res);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET all services
async function getAllServices(req, res) {
  const { category, search } = req.query;

  // Build query
  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true);

  // Filter by category
  if (category) {
    query = query.eq('category', category);
  }

  // Search by name or description
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Order by created_at
  query = query.order('created_at', { ascending: false });

  const { data: services, error: fetchError } = await query;

  if (fetchError) {
    console.error('Get services error:', fetchError);
    return error(res, 'Gagal mengambil data services', 500);
  }

  return success(res, {
    count: services.length,
    services
  });
}

// POST create service (Admin only)
async function createService(req, res) {
  const { protect, authorize } = require('../../lib/auth');
  
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { name, category, description, price, unit, image_url, features } = req.body;

  // Validation
  if (!name || !category || !price || !unit) {
    return error(res, 'Name, category, price, dan unit wajib diisi', 400);
  }

  // Create service
  const { data: service, error: createError } = await supabase
    .from('services')
    .insert([
      {
        name,
        category,
        description,
        price,
        unit,
        image_url,
        features: features || [],
        is_active: true
      }
    ])
    .select()
    .single();

  if (createError) {
    console.error('Create service error:', createError);
    return error(res, 'Gagal membuat service', 500);
  }

  return success(res, service, 'Service berhasil dibuat', 201);
}
