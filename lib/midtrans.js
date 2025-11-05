// Midtrans Configuration for Vercel Serverless
const midtransClient = require('midtrans-client');

// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Create Core API instance (for checking transaction status)
const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

/**
 * Create Midtrans transaction
 */
const createTransaction = async (orderData) => {
  try {
    const parameter = {
      transaction_details: {
        order_id: orderData.order_number,
        gross_amount: parseFloat(orderData.total_price)
      },
      customer_details: {
        first_name: orderData.customer_name,
        email: orderData.customer_email,
        phone: orderData.customer_phone
      },
      item_details: [
        {
          id: orderData.service_id,
          price: parseFloat(orderData.total_price),
          quantity: 1,
          name: orderData.service_name
        }
      ],
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/pesanan-saya.html`
      }
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction;
  } catch (error) {
    console.error('Midtrans create transaction error:', error);
    throw error;
  }
};

/**
 * Get transaction status
 */
const getTransactionStatus = async (orderId) => {
  try {
    const status = await coreApi.transaction.status(orderId);
    return status;
  } catch (error) {
    console.error('Midtrans get status error:', error);
    throw error;
  }
};

/**
 * Verify notification signature
 */
const verifyNotification = (notification) => {
  try {
    const crypto = require('crypto');
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    const { order_id, status_code, gross_amount, signature_key } = notification;
    
    // Create hash
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');
    
    return hash === signature_key;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

/**
 * Map Midtrans status to our status
 */
const mapPaymentStatus = (transactionStatus, fraudStatus) => {
  if (transactionStatus === 'capture') {
    if (fraudStatus === 'accept') {
      return 'paid';
    }
    return 'pending';
  } else if (transactionStatus === 'settlement') {
    return 'paid';
  } else if (transactionStatus === 'pending') {
    return 'pending';
  } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
    return 'failed';
  }
  return 'pending';
};

module.exports = {
  snap,
  coreApi,
  createTransaction,
  getTransactionStatus,
  verifyNotification,
  mapPaymentStatus
};
