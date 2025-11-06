// Payments API - Consolidated
// Handles: create midtrans transaction, midtrans notification webhook, check status
const { protect } = require('../lib/auth');
const { success, error, asyncHandler, setCorsHeaders } = require('../lib/response');
const { supabase } = require('../lib/supabase');
const { createTransaction, getTransactionStatus, verifyNotification } = require('../lib/midtrans');

export default asyncHandler(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { action, orderNumber } = req.query;
  
  // POST /api/payments?action=create
  if (req.method === 'POST' && action === 'create') {
    return await handleCreatePayment(req, res);
  }
  
  // POST /api/payments?action=notification (Midtrans webhook)
  if (req.method === 'POST' && action === 'notification') {
    return await handleMidtransNotification(req, res);
  }
  
  // GET /api/payments?action=check&orderNumber=xxx
  if (req.method === 'GET' && action === 'check' && orderNumber) {
    return await handleCheckStatus(req, res, orderNumber);
  }
  
  return error(res, 'Invalid action or method', 400);
});

// Create Midtrans transaction
async function handleCreatePayment(req, res) {
  const user = await protect(req);
  const { order_id } = req.body;
  
  // Get order with user info
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select(`
      *,
      users!inner (name, email, phone)
    `)
    .eq('id', order_id)
    .eq('user_id', user.id)
    .single();
  
  if (fetchError || !order) {
    return error(res, 'Pesanan tidak ditemukan', 404);
  }
  
  if (order.payment_status === 'paid') {
    return error(res, 'Pesanan sudah dibayar', 400);
  }
  
  // Create Midtrans transaction
  const midtransData = {
    order_number: order.order_number,
    total_price: order.total_price,
    service_id: order.service_id,
    service_name: order.service_name,
    customer_name: order.users.name,
    customer_email: order.users.email,
    customer_phone: order.users.phone
  };
  
  let transaction;
  try {
    transaction = await createTransaction(midtransData);
  } catch (midtransError) {
    console.error('Midtrans error:', midtransError);
    return error(res, 'Gagal membuat transaksi pembayaran', 500);
  }
  
  // Create payment record
  await supabase
    .from('payments')
    .insert([{
      order_id,
      payment_method: 'midtrans',
      amount: order.total_price,
      status: 'pending'
    }]);
  
  // Update order
  await supabase
    .from('orders')
    .update({
      payment_method: 'midtrans',
      updated_at: new Date().toISOString()
    })
    .eq('id', order_id);
  
  return success(res, {
    token: transaction.token,
    redirect_url: transaction.redirect_url
  });
}

// Handle Midtrans notification webhook
async function handleMidtransNotification(req, res) {
  const notification = req.body;
  
  console.log('📥 Midtrans notification:', notification.order_id, notification.transaction_status);
  
  // Verify signature
  if (!verifyNotification(notification)) {
    return error(res, 'Invalid signature', 403);
  }
  
  const { order_id, transaction_status, fraud_status, payment_type, transaction_id, gross_amount } = notification;
  
  // Get order
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', order_id)
    .single();
  
  if (fetchError || !order) {
    return error(res, 'Order not found', 404);
  }
  
  // Determine status
  let paymentStatus = order.payment_status;
  let orderStatus = order.status;
  let timelineDescription = '';
  
  if (transaction_status === 'capture') {
    if (fraud_status === 'accept') {
      paymentStatus = 'paid';
      orderStatus = 'scheduled';
      timelineDescription = 'Pembayaran berhasil dikonfirmasi oleh Midtrans';
    }
  } else if (transaction_status === 'settlement') {
    paymentStatus = 'paid';
    orderStatus = 'scheduled';
    timelineDescription = 'Pembayaran berhasil, pesanan dikonfirmasi';
  } else if (transaction_status === 'pending') {
    paymentStatus = 'pending';
    timelineDescription = 'Menunggu pembayaran';
  } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
    paymentStatus = 'failed';
    orderStatus = 'cancelled';
    timelineDescription = `Pembayaran ${transaction_status === 'deny' ? 'ditolak' : transaction_status === 'cancel' ? 'dibatalkan' : 'kadaluarsa'}`;
  }
  
  // Update payment
  await supabase
    .from('payments')
    .upsert([{
      order_id: order.id,
      payment_method: payment_type,
      amount: gross_amount,
      status: paymentStatus === 'paid' ? 'success' : paymentStatus === 'pending' ? 'pending' : 'failed',
      transaction_id,
      paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null
    }], { 
      onConflict: 'transaction_id',
      ignoreDuplicates: false 
    });
  
  // Update order
  await supabase
    .from('orders')
    .update({
      payment_status: paymentStatus,
      status: orderStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', order.id);
  
  // Add timeline
  await supabase
    .from('order_timeline')
    .insert([{
      order_id: order.id,
      status: orderStatus,
      description: timelineDescription
    }]);
  
  // Create notification if paid
  if (paymentStatus === 'paid') {
    await supabase
      .from('notifications')
      .insert([{
        user_id: order.user_id,
        title: 'Pembayaran Berhasil',
        message: `Pembayaran untuk pesanan ${order.order_number} telah berhasil`,
        type: 'payment'
      }]);
  }
  
  return success(res, { message: 'Notification processed' });
}

// Check payment status
async function handleCheckStatus(req, res, orderNumber) {
  const user = await protect(req);
  
  console.log('🔍 Checking payment status for:', orderNumber);
  
  // Get order
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();
  
  if (fetchError || !order) {
    return error(res, 'Pesanan tidak ditemukan', 404);
  }
  
  // If already paid
  if (order.payment_status === 'paid') {
    return success(res, {
      transaction_status: 'settlement',
      payment_status: 'paid',
      database_updated: false,
      already_paid: true
    }, 'Pesanan sudah dibayar');
  }
  
  // Check from Midtrans
  let statusResponse;
  try {
    statusResponse = await getTransactionStatus(orderNumber);
    console.log('📊 Midtrans status:', statusResponse.transaction_status);
  } catch (midtransError) {
    console.error('❌ Midtrans error:', midtransError.message);
    return success(res, {
      transaction_status: 'not_found',
      payment_status: order.payment_status
    }, 'Transaksi belum ditemukan di Midtrans');
  }
  
  // Update if paid
  let databaseUpdated = false;
  if (statusResponse.transaction_status === 'settlement' || statusResponse.transaction_status === 'capture') {
    console.log('✅ Payment successful! Updating database...');
    
    // Update order
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'scheduled',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);
    
    // Update/insert payment
    await supabase
      .from('payments')
      .upsert([{
        order_id: order.id,
        payment_method: statusResponse.payment_type || 'midtrans',
        amount: statusResponse.gross_amount,
        status: 'success',
        transaction_id: statusResponse.transaction_id,
        paid_at: new Date().toISOString()
      }], {
        onConflict: 'transaction_id',
        ignoreDuplicates: false
      });
    
    // Add timeline
    await supabase
      .from('order_timeline')
      .insert([{
        order_id: order.id,
        status: 'scheduled',
        description: 'Pembayaran berhasil dikonfirmasi via Midtrans'
      }]);
    
    // Create notification
    await supabase
      .from('notifications')
      .insert([{
        user_id: order.user_id,
        title: 'Pembayaran Berhasil',
        message: `Pembayaran untuk pesanan ${order.order_number} telah berhasil`,
        type: 'payment'
      }]);
    
    databaseUpdated = true;
  }
  
  return success(res, {
    transaction_status: statusResponse.transaction_status,
    payment_type: statusResponse.payment_type,
    payment_status: databaseUpdated ? 'paid' : order.payment_status,
    order_status: databaseUpdated ? 'scheduled' : order.status,
    database_updated: databaseUpdated,
    gross_amount: statusResponse.gross_amount
  }, databaseUpdated ? 'Status pembayaran berhasil diperbarui' : `Status pembayaran: ${statusResponse.transaction_status}`);
}
