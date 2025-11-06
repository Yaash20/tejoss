// Testimonials API - Consolidated
// Handles: GET all, GET by id, POST create, PUT update, DELETE, PUT approve (admin)
const { protect, authorize, optionalAuth } = require('../lib/auth');
const { success, error, asyncHandler, setCorsHeaders } = require('../lib/response');
const { supabase } = require('../lib/supabase');

export default asyncHandler(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id, action } = req.query;
  
  // GET /api/testimonials
  if (req.method === 'GET' && !id && !action) {
    return await handleGetTestimonials(req, res);
  }
  
  // GET /api/testimonials?action=my
  if (req.method === 'GET' && action === 'my') {
    return await handleGetMyTestimonials(req, res);
  }
  
  // GET /api/testimonials?action=all (Admin - including pending)
  if (req.method === 'GET' && action === 'all') {
    return await handleGetAllTestimonialsAdmin(req, res);
  }
  
  // GET /api/testimonials?id=123
  if (req.method === 'GET' && id) {
    return await handleGetTestimonial(req, res, id);
  }
  
  // POST /api/testimonials
  if (req.method === 'POST') {
    return await handleCreateTestimonial(req, res);
  }
  
  // PUT /api/testimonials?id=123
  if (req.method === 'PUT' && id && !action) {
    return await handleUpdateTestimonial(req, res, id);
  }
  
  // PUT /api/testimonials?id=123&action=approve (Admin)
  if (req.method === 'PUT' && id && action === 'approve') {
    return await handleApproveTestimonial(req, res, id);
  }
  
  // DELETE /api/testimonials?id=123
  if (req.method === 'DELETE' && id) {
    return await handleDeleteTestimonial(req, res, id);
  }
  
  return error(res, 'Invalid method or action', 400);
});

// Get all approved testimonials (Public)
async function handleGetTestimonials(req, res) {
  const { featured, limit = 50 } = req.query;
  
  let query = supabase
    .from('testimonials')
    .select(`
      *,
      users!inner (name, avatar_url)
    `)
    .eq('is_approved', true);
  
  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }
  
  query = query.order('created_at', { ascending: false }).limit(parseInt(limit));
  
  const { data: testimonials, error: fetchError } = await query;
  
  if (fetchError) {
    console.error('Get testimonials error:', fetchError);
    return error(res, 'Gagal mengambil testimonial', 500);
  }
  
  // Format response
  const formatted = testimonials?.map(t => ({
    ...t,
    user_name: t.users?.name,
    avatar_url: t.users?.avatar_url
  })) || [];
  
  return success(res, formatted);
}

// Get my testimonials
async function handleGetMyTestimonials(req, res) {
  const user = await protect(req);
  
  const { data: testimonials, error: fetchError } = await supabase
    .from('testimonials')
    .select(`
      *,
      orders (order_number, service_name)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (fetchError) {
    console.error('Get my testimonials error:', fetchError);
    return error(res, 'Gagal mengambil testimonial', 500);
  }
  
  return success(res, testimonials || []);
}

// Get all testimonials for admin (including pending)
async function handleGetAllTestimonialsAdmin(req, res) {
  const user = await protect(req);
  authorize(user, 'admin');
  
  const { data: testimonials, error: fetchError } = await supabase
    .from('testimonials')
    .select(`
      *,
      users!inner (name, email),
      orders (order_number, service_name)
    `)
    .order('created_at', { ascending: false });
  
  if (fetchError) {
    console.error('Get all testimonials error:', fetchError);
    return error(res, 'Gagal mengambil testimonial', 500);
  }
  
  // Format with status
  const formatted = testimonials?.map(t => ({
    ...t,
    message: t.comment,
    status: t.is_approved ? 'approved' : 'pending',
    user_name: t.users?.name,
    user_email: t.users?.email,
    order_number: t.orders?.order_number,
    service_name: t.orders?.service_name
  })) || [];
  
  return success(res, formatted);
}

// Get single testimonial
async function handleGetTestimonial(req, res, id) {
  const { data: testimonial, error: fetchError } = await supabase
    .from('testimonials')
    .select(`
      *,
      users!inner (name, email, avatar_url),
      orders (order_number, service_name)
    `)
    .eq('id', id)
    .single();
  
  if (fetchError || !testimonial) {
    return error(res, 'Testimoni tidak ditemukan', 404);
  }
  
  const formatted = {
    ...testimonial,
    message: testimonial.comment,
    status: testimonial.is_approved ? 'approved' : 'pending',
    user_name: testimonial.users?.name,
    user_email: testimonial.users?.email,
    avatar_url: testimonial.users?.avatar_url,
    order_number: testimonial.orders?.order_number,
    service_name: testimonial.orders?.service_name
  };
  
  return success(res, formatted);
}

// Create testimonial
async function handleCreateTestimonial(req, res) {
  const user = await protect(req);
  const { order_id, rating, comment, message, service_name } = req.body;
  const testimonialMessage = comment || message;
  
  // Validate
  if (!rating || rating < 1 || rating > 5) {
    return error(res, 'Rating harus antara 1-5', 400);
  }
  
  if (!testimonialMessage || testimonialMessage.trim().length < 10) {
    return error(res, 'Testimoni minimal 10 karakter', 400);
  }
  
  // If order_id provided, verify it
  if (order_id && order_id !== 'null' && order_id !== 'undefined') {
    const orderIdInt = typeof order_id === 'string' ? parseInt(order_id, 10) : order_id;
    
    if (!isNaN(orderIdInt)) {
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('id', orderIdInt)
        .eq('user_id', user.id)
        .single();
      
      if (!order) {
        return error(res, 'Pesanan tidak ditemukan atau bukan milik Anda', 400);
      }
      
      // Check if testimonial already exists
      const { data: existing } = await supabase
        .from('testimonials')
        .select('id')
        .eq('order_id', orderIdInt)
        .single();
      
      if (existing) {
        return error(res, 'Testimoni untuk pesanan ini sudah ada', 400);
      }
    }
  }
  
  // Create testimonial
  const orderIdInt = order_id && order_id !== 'null' && order_id !== 'undefined'
    ? (typeof order_id === 'string' ? parseInt(order_id, 10) : order_id)
    : null;
  
  const insertData = {
    user_id: user.id,
    rating,
    comment: testimonialMessage,
    is_approved: false
  };
  
  if (orderIdInt && !isNaN(orderIdInt)) {
    insertData.order_id = orderIdInt;
  }
  
  const { data: testimonial, error: insertError } = await supabase
    .from('testimonials')
    .insert([insertData])
    .select()
    .single();
  
  if (insertError) {
    console.error('Create testimonial error:', insertError);
    return error(res, 'Gagal membuat testimoni', 500);
  }
  
  return success(res, testimonial, 'Testimoni berhasil dibuat, menunggu persetujuan admin', 201);
}

// Update testimonial
async function handleUpdateTestimonial(req, res, id) {
  const user = await protect(req);
  const { rating, comment } = req.body;
  
  const updateData = { is_approved: false };
  if (rating !== undefined) updateData.rating = rating;
  if (comment !== undefined) updateData.comment = comment;
  
  const { data: testimonial, error: updateError } = await supabase
    .from('testimonials')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  
  if (updateError || !testimonial) {
    return error(res, 'Testimoni tidak ditemukan', 404);
  }
  
  return success(res, testimonial, 'Testimoni berhasil diupdate, menunggu persetujuan admin');
}

// Delete testimonial
async function handleDeleteTestimonial(req, res, id) {
  const user = await protect(req);
  
  const { data: testimonial, error: deleteError } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  
  if (deleteError || !testimonial) {
    return error(res, 'Testimoni tidak ditemukan', 404);
  }
  
  return success(res, null, 'Testimoni berhasil dihapus');
}

// Approve/reject testimonial (Admin)
async function handleApproveTestimonial(req, res, id) {
  const user = await protect(req);
  authorize(user, 'admin');
  
  const { is_approved, is_featured, status } = req.body;
  
  // Support both formats
  let approvalValue = is_approved;
  if (status) {
    approvalValue = status === 'approved';
  }
  
  const updateData = { is_approved: approvalValue };
  if (is_featured !== undefined) {
    updateData.is_featured = is_featured;
  }
  
  const { data: testimonial, error: updateError } = await supabase
    .from('testimonials')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (updateError || !testimonial) {
    return error(res, 'Testimoni tidak ditemukan', 404);
  }
  
  return success(res, testimonial, approvalValue ? 'Testimoni berhasil disetujui' : 'Testimoni ditolak');
}
