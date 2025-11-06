// Orders API - Consolidated
// Handles: GET all, GET by id, POST create, PUT update status, PUT cancel, GET stats
const { protect, authorize } = require('../lib/auth');
const { success, error, asyncHandler, setCorsHeaders } = require('../lib/response');
const { supabase } = require('../lib/supabase');

export default asyncHandler(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id, action } = req.query;
  
  // GET /api/orders?action=stats
  if (req.method === 'GET' && action === 'stats') {
    return await handleGetStats(req, res);
  }
  
  // GET /api/orders
  if (req.method === 'GET' && !id) {
    return await handleGetOrders(req, res);
  }
  
  // GET /api/orders?id=123
  if (req.method === 'GET' && id) {
    return await handleGetOrder(req, res, id);
  }
  
  // POST /api/orders
  if (req.method === 'POST') {
    return await handleCreateOrder(req, res);
  }
  
  // PUT /api/orders?id=123&action=status (Admin)
  if (req.method === 'PUT' && id && action === 'status') {
    return await handleUpdateStatus(req, res, id);
  }
  
  // PUT /api/orders?id=123&action=cancel
  if (req.method === 'PUT' && id && action === 'cancel') {
    return await handleCancelOrder(req, res, id);
  }
  
  return error(res, 'Invalid action or method', 400);
});

// Generate unique order number
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TJ-${timestamp}-${random}`;
}

// Get all orders
async function handleGetOrders(req, res) {
  const user = await protect(req);
  const { status, payment_status, search } = req.query;
  
  let query = supabase.from('orders').select(`
    *,
    order_timeline (*)
  `);
  
  // Admin sees all orders, users see only their orders
  if (user.role !== 'admin') {
    query = query.eq('user_id', user.id);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (payment_status) {
    query = query.eq('payment_status', payment_status);
  }
  
  if (search) {
    query = query.or(`order_number.ilike.%${search}%,service_name.ilike.%${search}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data: orders, error: fetchError } = await query;
  
  if (fetchError) {
    console.error('Get orders error:', fetchError);
    return error(res, 'Gagal mengambil data pesanan', 500);
  }
  
  // Format timeline
  const ordersWithTimeline = orders.map(order => ({
    ...order,
    timeline: order.order_timeline || []
  }));
  
  return success(res, ordersWithTimeline);
}

// Get single order
async function handleGetOrder(req, res, id) {
  const user = await protect(req);
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_timeline (*),
      payments (*)
    `)
    .eq('id', id);
  
  // Non-admin can only view their own orders
  if (user.role !== 'admin') {
    query = query.eq('user_id', user.id);
  }
  
  const { data: order, error: fetchError } = await query.single();
  
  if (fetchError || !order) {
    return error(res, 'Pesanan tidak ditemukan', 404);
  }
  
  return success(res, {
    ...order,
    timeline: order.order_timeline || [],
    payment: order.payments?.[0] || null
  });
}

// Create order
async function handleCreateOrder(req, res) {
  const user = await protect(req);
  const { service_id, quantity, location, schedule_date, notes, payment_method } = req.body;
  
  // Get service details
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('name, price, unit')
    .eq('id', service_id)
    .eq('is_active', true)
    .single();
  
  if (serviceError || !service) {
    return error(res, 'Service tidak ditemukan', 404);
  }
  
  const total_price = service.price * quantity;
  const order_number = generateOrderNumber();
  
  // Insert order
  const { data: order, error: insertError } = await supabase
    .from('orders')
    .insert([{
      order_number,
      user_id: user.id,
      service_id,
      service_name: service.name,
      quantity,
      unit: service.unit,
      total_price,
      location,
      schedule_date,
      notes,
      payment_method,
      status: 'pending',
      payment_status: 'unpaid'
    }])
    .select()
    .single();
  
  if (insertError) {
    console.error('Create order error:', insertError);
    return error(res, 'Gagal membuat pesanan', 500);
  }
  
  // Insert timeline
  await supabase
    .from('order_timeline')
    .insert([{
      order_id: order.id,
      status: 'pending',
      description: 'Pesanan dibuat dan menunggu pembayaran'
    }]);
  
  // Create notification
  await supabase
    .from('notifications')
    .insert([{
      user_id: user.id,
      title: 'Pesanan Baru',
      message: `Pesanan ${order_number} berhasil dibuat`,
      type: 'order'
    }]);
  
  return success(res, order, 'Pesanan berhasil dibuat', 201);
}

// Update order status (Admin only)
async function handleUpdateStatus(req, res, id) {
  const user = await protect(req);
  authorize(user, 'admin');
  
  const { status, description } = req.body;
  
  // Update order
  const { data: order, error: updateError } = await supabase
    .from('orders')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (updateError || !order) {
    return error(res, 'Pesanan tidak ditemukan', 404);
  }
  
  // Add timeline
  await supabase
    .from('order_timeline')
    .insert([{
      order_id: id,
      status,
      description: description || `Status diubah menjadi ${status}`
    }]);
  
  // Create notification
  await supabase
    .from('notifications')
    .insert([{
      user_id: order.user_id,
      title: 'Update Pesanan',
      message: `Pesanan ${order.order_number}: ${description || status}`,
      type: 'order'
    }]);
  
  return success(res, order, 'Status pesanan berhasil diupdate');
}

// Cancel order
async function handleCancelOrder(req, res, id) {
  const user = await protect(req);
  
  // Get order
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  
  if (fetchError || !order) {
    return error(res, 'Pesanan tidak ditemukan', 404);
  }
  
  if (order.status === 'completed' || order.status === 'cancelled') {
    return error(res, 'Pesanan tidak dapat dibatalkan', 400);
  }
  
  // Update to cancelled
  const { data: updatedOrder, error: updateError } = await supabase
    .from('orders')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (updateError) {
    return error(res, 'Gagal membatalkan pesanan', 500);
  }
  
  // Add timeline
  await supabase
    .from('order_timeline')
    .insert([{
      order_id: id,
      status: 'cancelled',
      description: 'Pesanan dibatalkan oleh pelanggan'
    }]);
  
  return success(res, updatedOrder, 'Pesanan berhasil dibatalkan');
}

// Get order statistics
async function handleGetStats(req, res) {
  const user = await protect(req);
  
  // Get all orders for user
  const { data: orders } = await supabase
    .from('orders')
    .select('status, total_price, payment_status')
    .eq('user_id', user.id);
  
  // Count by status
  const statusCounts = {};
  let totalSpending = 0;
  
  orders?.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    if (order.payment_status === 'paid') {
      totalSpending += parseFloat(order.total_price);
    }
  });
  
  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);
  
  return success(res, {
    statusCounts: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    totalSpending,
    recentOrders: recentOrders || []
  });
}
