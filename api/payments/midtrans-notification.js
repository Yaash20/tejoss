// Payments: Midtrans webhook notification handler
const { supabase } = require('../../lib/supabase');
const { verifyNotification, mapPaymentStatus } = require('../../lib/midtrans');
const { success, error, asyncHandler } = require('../../lib/response');

module.exports = asyncHandler(async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return error(res, 'Method not allowed', 405);
  }

  const notification = req.body;

  console.log('Midtrans notification received:', notification);

  // Verify notification signature
  const isValid = verifyNotification(notification);

  if (!isValid) {
    console.error('Invalid Midtrans notification signature');
    return error(res, 'Invalid signature', 403);
  }

  const { order_id, transaction_status, fraud_status, payment_type } = notification;

  // Map Midtrans status to our status
  const paymentStatus = mapPaymentStatus(transaction_status, fraud_status);

  try {
    // Get order by order_number
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id, order_number, payment_status as old_payment_status, status as old_status')
      .eq('order_number', order_id)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', order_id);
      return error(res, 'Order tidak ditemukan', 404);
    }

    // Update payment record
    const updatePaymentData = {
      status: paymentStatus,
      payment_method: payment_type,
      updated_at: new Date().toISOString()
    };

    if (paymentStatus === 'paid') {
      updatePaymentData.paid_at = new Date().toISOString();
    }

    await supabase
      .from('payments')
      .update(updatePaymentData)
      .eq('transaction_id', order_id);

    // Update order status
    const updateOrderData = {
      payment_status: paymentStatus,
      payment_method: payment_type,
      updated_at: new Date().toISOString()
    };

    // If payment successful, update order status to 'confirmed'
    if (paymentStatus === 'paid' && order.old_status === 'pending') {
      updateOrderData.status = 'confirmed';
    }

    await supabase
      .from('orders')
      .update(updateOrderData)
      .eq('id', order.id);

    // Add timeline entry if status changed
    if (paymentStatus !== order.old_payment_status) {
      const timelineDescription = paymentStatus === 'paid' 
        ? 'Pembayaran berhasil diterima'
        : paymentStatus === 'failed'
        ? 'Pembayaran gagal'
        : 'Status pembayaran diperbarui';

      await supabase
        .from('order_timeline')
        .insert([
          {
            order_id: order.id,
            status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
            description: timelineDescription
          }
        ]);

      // Create notification
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: order.user_id,
            title: 'Update Pembayaran',
            message: `${timelineDescription} untuk pesanan ${order.order_number}`,
            type: 'payment'
          }
        ]);
    }

    console.log(`Payment updated for order ${order_id}: ${paymentStatus}`);

    return success(res, {
      order_id,
      payment_status: paymentStatus
    }, 'Notification processed successfully');
  } catch (err) {
    console.error('Error processing notification:', err);
    return error(res, 'Failed to process notification', 500);
  }
});
