// B2B: Get all partnerships & Create partnership
const { supabase } = require('../../lib/supabase');
const { protect, authorize, optionalAuth } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');
const { validateRequest, validationRules } = require('../../lib/validation');

module.exports = asyncHandler(async (req, res) => {
  if (req.method === 'GET') {
    return await getB2BPartnerships(req, res);
  } else if (req.method === 'POST') {
    return await createB2BPartnership(req, res);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET all B2B partnerships (Admin only)
async function getB2BPartnerships(req, res) {
  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  const { status, search } = req.query;

  let query = supabase
    .from('b2b_partnerships')
    .select('*');

  // Filter by status
  if (status) {
    query = query.eq('status', status);
  }

  // Search by company name or email
  if (search) {
    query = query.or(`company_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = query.order('created_at', { ascending: false });

  const { data: partnerships, error: fetchError } = await query;

  if (fetchError) {
    console.error('Get B2B partnerships error:', fetchError);
    return error(res, 'Gagal mengambil data B2B partnerships', 500);
  }

  return success(res, {
    count: partnerships.length,
    partnerships
  });
}

// POST create B2B partnership (Public)
async function createB2BPartnership(req, res) {
  const { company_name, contact_person, email, phone, company_type, description } = req.body;

  // Validate request
  const validation = validateRequest(req.body, validationRules.createB2B);
  if (!validation.isValid) {
    return error(res, validation.errors[0].message, 400);
  }

  // Create B2B partnership
  const { data: partnership, error: createError } = await supabase
    .from('b2b_partnerships')
    .insert([
      {
        company_name,
        contact_person: contact_person || null,
        email,
        phone,
        company_type: company_type || null,
        description: description || null,
        status: 'pending'
      }
    ])
    .select()
    .single();

  if (createError) {
    console.error('Create B2B partnership error:', createError);
    return error(res, 'Gagal membuat B2B partnership', 500);
  }

  return success(res, partnership, 'Permintaan kemitraan berhasil dikirim', 201);
}
