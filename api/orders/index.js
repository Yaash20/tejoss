// Orders: Get all orders & Create order
const { supabase } = require('../../lib/supabase');
const { protect, authorize } = require('../../lib/auth');
const { success, error, notFound, asyncHandler } = require('../../lib/response');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TJ-${timestamp}-${random}`;
};

module.exports = asyncHandler(async (req, res) => {
  if (req.method === 'GET') {
    return await getOrders(req, res);
  } else if (req.method === 'POST') {
    return await createOrder(req, res);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// GET all orders
async function getOrders(req, res) {
  // Verify authentication
  const user = await protect(req);
  
  const { status, payment_status, search } = req.query;

  let query;

  // Admin sees ALL orders with customer info, regular user sees only their orders
  if (user.role === 'admin') {
    query = supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey (
          name,
          phone,
          email
        )
      `);
  } else {
    query = supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id);
  }

  // Filter by status
  if (status) {
    query = query.eq('status', status);
  }

  // Filter by payment_status
  if (payment_status) {
    query = query.eq('payment_status', payment_status);
  }

  // Search by order_number or service_name
  if (search) {
    query = query.or(`order_number.ilike.%${search}%,service_name.ilike.%${search}%`);
  }

  // Order by created_at DESC
  query = query.order('created_at', { ascending: false });

  const { data: orders, error: fetchError } = await query;

  if (fetchError) {
    console.error('Get orders error:', fetchError);
    return error(res, 'Gagal mengambil data orders', 500);
  }

  // Format response for admin (add customer info)
  const formattedOrders = user.role === 'admin' 
    ? orders.map(order => ({
        ...order,
        customer_name: order.users?.name,
        customer_phone: order.users?.phone,
        customer_email: order.users?.email,
        users: undefined
      }))
    : orders;

  return success(res, {
    count: formattedOrders.length,
    orders: formattedOrders
  });
}

// POST create order
async function createOrder(req, res) {
  // Verify authentication
  const user = await protect(req);
  
  const { service_id, quantity, location, schedule_date, notes, payment_method } = req.body;

  // Validation
  if (!service_id || !quantity || !location || !schedule_date) {
    return error(res, 'Service ID, quantity, location, dan schedule_date wajib diisi', 400);
  }

  // Get service details
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('name, price, unit')
    .eq('id', service_id)
    .eq('is_active', true)
    .single();

  if (serviceError || !service) {
    return notFound(res, 'Service tidak ditemukan');
  }

  const total_price = service.price * quantity;
  const order_number = generateOrderNumber();

  // Create order
  const { data: order, error: createError } = await supabase
    .from('orders')
    .insert([
      {
        order_number,
        user_id: user.id,
        service_id,
        service_name: service.name,
        quantity,
        unit: service.unit,
        total_price,
        location,
        schedule_date,
        notes: notes || null,
        payment_method: payment_method || null,
        status: 'pending',
        payment_status: 'unpaid'
      }
    ])
    .select()
    .single();

  if (createError) {
    console.error('Create order error:', createError);
    return error(res, 'Gagal membuat order', 500);
  }

  // Insert initial timeline
  await supabase
    .from('order_timeline')
    .insert([
      {
        order_id: order.id,
        status: 'pending',
        description: 'Pesanan dibuat dan menunggu pembayaran'
      }
    ]);

  // Create notification for user
  await supabase
    .from('notifications')
    .insert([
      {
        user_id: user.id,
        title: 'Pesanan Baru',
        message: `Pesanan ${order_number} berhasil dibuat`,
        type: 'order'
      }
    ]);

  return success(res, order, 'Pesanan berhasil dibuat', 201);
}
