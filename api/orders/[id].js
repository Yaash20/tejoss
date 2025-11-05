// Orders: Get/Update single order
const { supabase } = require('../../lib/supabase');
const { protect, authorize } = require('../../lib/auth');
const { success, error, notFound, forbidden, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return error(res, 'Order ID diperlukan', 400);
  }

  if (req.method === 'GET') {
    return await getOrder(req, res, id);
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    return await updateOrder(req, res, id);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET single order with timeline
async function getOrder(req, res, id) {
  // Verify authentication
  const user = await protect(req);

  // Get order with timeline
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select(`
      *,
      users!orders_user_id_fkey (
        name,
        phone,
        email
      ),
      order_timeline (
        id,
        status,
        description,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (fetchError || !order) {
    return notFound(res, 'Order tidak ditemukan');
  }

  // Check authorization (user can only see their own orders, admin can see all)
  if (user.role !== 'admin' && order.user_id !== user.id) {
    return forbidden(res, 'Anda tidak memiliki akses ke order ini');
  }

  // Format response
  const formattedOrder = {
    ...order,
    customer_name: order.users?.name,
    customer_phone: order.users?.phone,
    customer_email: order.users?.email,
    timeline: order.order_timeline || [],
    users: undefined,
    order_timeline: undefined
  };

  return success(res, formattedOrder);
}

// UPDATE order (status, payment_status, etc)
async function updateOrder(req, res, id) {
  // Verify authentication
  const user = await protect(req);
  
  const { status, payment_status, payment_method, notes } = req.body;

  // Get existing order
  const { data: existingOrder, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !existingOrder) {
    return notFound(res, 'Order tidak ditemukan');
  }

  // Check authorization
  // Regular users can only update their own orders (limited fields)
  // Admins can update any order (all fields)
  if (user.role !== 'admin' && existingOrder.user_id !== user.id) {
    return forbidden(res, 'Anda tidak memiliki akses ke order ini');
  }

  // Build update object
  const updateData = {};
  
  if (user.role === 'admin') {
    // Admin can update all fields
    if (status !== undefined) updateData.status = status;
    if (payment_status !== undefined) updateData.payment_status = payment_status;
    if (payment_method !== undefined) updateData.payment_method = payment_method;
    if (notes !== undefined) updateData.notes = notes;
  } else {
    // Regular user can only update notes
    if (notes !== undefined) updateData.notes = notes;
  }
  
  updateData.updated_at = new Date().toISOString();

  // Update order
  const { data: updatedOrder, error: updateError } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Update order error:', updateError);
    return error(res, 'Gagal update order', 500);
  }

  // If status changed, add timeline entry
  if (status && status !== existingOrder.status) {
    const statusDescriptions = {
      'pending': 'Pesanan menunggu pembayaran',
      'paid': 'Pembayaran diterima',
      'confirmed': 'Pesanan dikonfirmasi',
      'scheduled': 'Pesanan dijadwalkan',
      'in_progress': 'Pesanan sedang dikerjakan',
      'completed': 'Pesanan selesai',
      'cancelled': 'Pesanan dibatalkan'
    };

    await supabase
      .from('order_timeline')
      .insert([
        {
          order_id: id,
          status: status,
          description: statusDescriptions[status] || `Status diubah menjadi ${status}`
        }
      ]);

    // Create notification
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: existingOrder.user_id,
          title: 'Update Pesanan',
          message: `Status pesanan ${existingOrder.order_number} diubah menjadi ${status}`,
          type: 'order'
        }
      ]);
  }

  return success(res, updatedOrder, 'Order berhasil diupdate');
}
