// Payments: Create payment & Get payment details
const { supabase } = require('../../lib/supabase');
const { protect } = require('../../lib/auth');
const { createTransaction } = require('../../lib/midtrans');
const { success, error, notFound, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  if (req.method === 'POST') {
    return await createPayment(req, res);
  } else if (req.method === 'GET') {
    return await getPayment(req, res);
  } else {
    return error(res, 'Method not allowed', 405);
  }
});

// POST create payment (initiate Midtrans transaction)
async function createPayment(req, res) {
  // Verify authentication
  const user = await protect(req);
  
  const { order_id, payment_method } = req.body;

  if (!order_id) {
    return error(res, 'Order ID wajib diisi', 400);
  }

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .single();

  if (orderError || !order) {
    return notFound(res, 'Order tidak ditemukan');
  }

  // Check if order belongs to user
  if (order.user_id !== user.id) {
    return error(res, 'Anda tidak memiliki akses ke order ini', 403);
  }

  // Check if order is already paid
  if (order.payment_status === 'paid') {
    return error(res, 'Order sudah dibayar', 400);
  }

  try {
    // Create Midtrans transaction
    const transaction = await createTransaction({
      order_number: order.order_number,
      total_price: order.total_price,
      service_id: order.service_id,
      service_name: order.service_name,
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: user.phone
    });

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          order_id: order.id,
          payment_method: payment_method || 'midtrans',
          amount: order.total_price,
          status: 'pending',
          transaction_id: order.order_number
        }
      ])
      .select()
      .single();

    if (paymentError) {
      console.error('Create payment error:', paymentError);
      return error(res, 'Gagal membuat payment', 500);
    }

    return success(res, {
      payment,
      midtrans_token: transaction.token,
      midtrans_redirect_url: transaction.redirect_url
    }, 'Payment berhasil dibuat', 201);
  } catch (err) {
    console.error('Midtrans error:', err);
    return error(res, 'Gagal membuat transaksi pembayaran', 500);
  }
}

// GET payment details
async function getPayment(req, res) {
  // Verify authentication
  const user = await protect(req);
  
  const { order_id } = req.query;

  if (!order_id) {
    return error(res, 'Order ID diperlukan', 400);
  }

  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', order_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !payment) {
    return notFound(res, 'Payment tidak ditemukan');
  }

  return success(res, payment);
}
