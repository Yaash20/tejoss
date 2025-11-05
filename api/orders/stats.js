// Orders: Get statistics (Admin only)
const { supabase } = require('../../lib/supabase');
const { protect, authorize } = require('../../lib/auth');
const { success, error, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  // Only allow GET
  if (req.method !== 'GET') {
    return error(res, 'Method not allowed', 405);
  }

  // Verify authentication and admin role
  const user = await protect(req);
  authorize(user, 'admin');

  // Get total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get orders by status
  const { data: ordersByStatus } = await supabase
    .from('orders')
    .select('status');

  const statusCounts = ordersByStatus?.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get orders by payment status
  const { data: ordersByPaymentStatus } = await supabase
    .from('orders')
    .select('payment_status');

  const paymentStatusCounts = ordersByPaymentStatus?.reduce((acc, order) => {
    acc[order.payment_status] = (acc[order.payment_status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get total revenue
  const { data: paidOrders } = await supabase
    .from('orders')
    .select('total_price')
    .eq('payment_status', 'paid');

  const totalRevenue = paidOrders?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;

  // Get recent orders (last 10)
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      service_name,
      total_price,
      status,
      payment_status,
      created_at,
      users!orders_user_id_fkey (
        name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  // Format recent orders
  const formattedRecentOrders = recentOrders?.map(order => ({
    ...order,
    customer_name: order.users?.name,
    customer_email: order.users?.email,
    users: undefined
  })) || [];

  return success(res, {
    total_orders: totalOrders || 0,
    orders_by_status: statusCounts,
    orders_by_payment_status: paymentStatusCounts,
    total_revenue: totalRevenue,
    recent_orders: formattedRecentOrders
  });
});
