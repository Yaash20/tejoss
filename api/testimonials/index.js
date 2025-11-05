// Testimonials: Get all & Create testimonial
const { supabase } = require('../../lib/supabase');
const { protect, optionalAuth, authorize } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');
const { validateRequest, validationRules } = require('../../lib/validation');

module.exports = asyncHandler(async (req, res) => {
  if (req.method === 'GET') {
    return await getTestimonials(req, res);
  } else if (req.method === 'POST') {
    return await createTestimonial(req, res);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET all testimonials
async function getTestimonials(req, res) {
  // Optional auth (public can view, but with different data)
  const user = await optionalAuth(req);
  
  const { featured, approved } = req.query;

  let query = supabase
    .from('testimonials')
    .select(`
      *,
      users!testimonials_user_id_fkey (
        name,
        avatar_url
      ),
      orders!testimonials_order_id_fkey (
        order_number,
        service_name
      )
    `);

  // Filter by featured
  if (featured !== undefined) {
    query = query.eq('is_featured', featured === 'true');
  }

  // Filter by approved (public only sees approved)
  if (user?.role === 'admin') {
    // Admin can see all testimonials
    if (approved !== undefined) {
      query = query.eq('is_approved', approved === 'true');
    }
  } else {
    // Public only sees approved testimonials
    query = query.eq('is_approved', true);
  }

  query = query.order('created_at', { ascending: false });

  const { data: testimonials, error: fetchError } = await query;

  if (fetchError) {
    console.error('Get testimonials error:', fetchError);
    return error(res, 'Gagal mengambil data testimonials', 500);
  }

  // Format response
  const formattedTestimonials = testimonials.map(testimonial => ({
    ...testimonial,
    user_name: testimonial.users?.name,
    user_avatar: testimonial.users?.avatar_url,
    order_number: testimonial.orders?.order_number,
    service_name: testimonial.orders?.service_name,
    users: undefined,
    orders: undefined
  }));

  return success(res, {
    count: formattedTestimonials.length,
    testimonials: formattedTestimonials
  });
}

// POST create testimonial
async function createTestimonial(req, res) {
  // Verify authentication
  const user = await protect(req);
  
  // Support both 'comment' and 'message' field names for compatibility
  const { order_id, rating, comment, message } = req.body;
  const testimonialComment = comment || message;

  // Validate request
  const validation = validateRequest(req.body, validationRules.createTestimonial);
  if (!validation.isValid) {
    return error(res, validation.errors[0].message, 400);
  }

  // Validate rating range
  if (rating < 1 || rating > 5) {
    return error(res, 'Rating harus antara 1-5', 400);
  }
  
  // Validate comment/message length (optional but if provided must be at least 10 chars)
  if (testimonialComment && testimonialComment.trim().length < 10) {
    return error(res, 'Testimoni minimal 10 karakter', 400);
  }

  // If order_id provided, verify order belongs to user
  if (order_id) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('user_id, payment_status')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return error(res, 'Order tidak ditemukan', 404);
    }

    if (order.user_id !== user.id) {
      return error(res, 'Order bukan milik Anda', 403);
    }

    // Allow testimonials for any order status (pending, paid, completed, etc.)
    // No need to require payment_status === 'paid'
  }

  // Create testimonial
  const { data: testimonial, error: createError } = await supabase
    .from('testimonials')
    .insert([
      {
        user_id: user.id,
        order_id: order_id || null,
        rating,
        comment: testimonialComment || null,
        is_approved: false, // Need admin approval
        is_featured: false
      }
    ])
    .select()
    .single();

  if (createError) {
    console.error('Create testimonial error:', createError);
    return error(res, 'Gagal membuat testimonial', 500);
  }

  return success(res, testimonial, 'Testimonial berhasil dibuat dan menunggu persetujuan admin', 201);
}
