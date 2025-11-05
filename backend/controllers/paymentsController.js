const { query, transaction } = require('../config/database');
const { snap, coreApi } = require('../config/midtrans');
const crypto = require('crypto');

// @desc    Create Midtrans transaction token
// @route   POST /api/payments/midtrans/create
// @access  Private
exports.createMidtransTransaction = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const user_id = req.user.id;

    // Verify order belongs to user
    const orderResult = await query(
      `SELECT o.*, u.name, u.email, u.phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = $1 AND o.user_id = $2`,
      [order_id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    const order = orderResult.rows[0];

    if (order.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Pesanan sudah dibayar'
      });
    }

    // Check if transaction already exists in Midtrans
    let snapTransaction;
    try {
      // Try to check existing transaction status
      const existingStatus = await coreApi.transaction.status(order.order_number);
      
      // If transaction exists and is pending, we can reuse it
      if (existingStatus.transaction_status === 'pending') {
        console.log(`Reusing existing pending transaction for ${order.order_number}`);
        
        // Get token from existing transaction (create new snap token)
        snapTransaction = await snap.createTransaction({
          transaction_details: {
            order_id: order.order_number + '-R' + Date.now(), // Add retry suffix to avoid duplicate
            gross_amount: parseInt(order.total_price)
          },
          customer_details: {
            first_name: order.name,
            email: order.email,
            phone: order.phone
          },
          item_details: [
            {
              id: order.service_id,
              price: parseInt(order.total_price),
              quantity: 1,
              name: order.service_name
            }
          ]
        });
      } else {
        throw new Error('Transaction exists with different status');
      }
    } catch (checkError) {
      // Transaction doesn't exist or error checking, create new one
      console.log(`Creating new transaction for ${order.order_number}`);
      
      snapTransaction = await snap.createTransaction({
        transaction_details: {
          order_id: order.order_number,
          gross_amount: parseInt(order.total_price)
        },
        customer_details: {
          first_name: order.name,
          email: order.email,
          phone: order.phone
        },
        item_details: [
          {
            id: order.service_id,
            price: parseInt(order.total_price),
            quantity: 1,
            name: order.service_name
          }
        ],
        callbacks: {
          finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#myorders`
        }
      });
    }

    // Create initial payment record and update order in transaction
    await transaction(async (client) => {
      // Check if payment record already exists for this order
      const existingPayment = await client.query(
        'SELECT id FROM payments WHERE order_id = $1 AND status = $2',
        [order_id, 'pending']
      );

      // Create payment record with pending status if not exists
      if (existingPayment.rows.length === 0) {
        await client.query(
          `INSERT INTO payments (order_id, payment_method, amount, status) 
           VALUES ($1, $2, $3, $4)`,
          [
            order_id,
            'midtrans',
            order.total_price,
            'pending'
          ]
        );
      }

      // Update order with midtrans token
      await client.query(
        `UPDATE orders 
         SET payment_method = 'midtrans', 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [order_id]
      );
    });

    res.status(200).json({
      success: true,
      data: {
        token: snapTransaction.token,
        redirect_url: snapTransaction.redirect_url
      }
    });
  } catch (error) {
    console.error('Midtrans create transaction error:', error);
    
    // Return more detailed error
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal membuat transaksi pembayaran'
    });
  }
};

// @desc    Handle Midtrans notification webhook
// @route   POST /api/payments/midtrans/notification
// @access  Public (called by Midtrans)
exports.handleMidtransNotification = async (req, res, next) => {
  try {
    const notification = req.body;
    
    // Verify notification authenticity
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hashedKey = crypto
      .createHash('sha512')
      .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`)
      .digest('hex');

    if (hashedKey !== notification.signature_key) {
      return res.status(403).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const paymentType = notification.payment_type;

    console.log(`Midtrans notification received for order ${orderId}: ${transactionStatus}`);

    // Get order from database
    const orderResult = await query(
      'SELECT * FROM orders WHERE order_number = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Handle different transaction statuses
    let newStatus = order.status;
    let paymentStatus = order.payment_status;
    let timelineDescription = '';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        paymentStatus = 'paid';
        newStatus = 'confirmed';
        timelineDescription = 'Pembayaran berhasil dikonfirmasi oleh Midtrans';
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'paid';
      newStatus = 'confirmed';
      timelineDescription = 'Pembayaran berhasil, pesanan dikonfirmasi';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
      timelineDescription = 'Menunggu pembayaran';
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      paymentStatus = 'failed';
      newStatus = 'cancelled';
      timelineDescription = `Pembayaran ${transactionStatus === 'deny' ? 'ditolak' : transactionStatus === 'cancel' ? 'dibatalkan' : 'kadaluarsa'}`;
    }

    // Update database in transaction
    await transaction(async (client) => {
      // Update or insert payment record
      const paymentResult = await client.query(
        `INSERT INTO payments (order_id, payment_method, amount, status, transaction_id, paid_at) 
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (transaction_id) 
         DO UPDATE SET status = $4, paid_at = $6
         RETURNING *`,
        [
          order.id,
          paymentType,
          notification.gross_amount,
          paymentStatus === 'paid' ? 'success' : paymentStatus === 'pending' ? 'pending' : 'failed',
          notification.transaction_id,
          paymentStatus === 'paid' ? new Date() : null
        ]
      );

      // Update order
      await client.query(
        `UPDATE orders 
         SET payment_status = $1, 
             status = $2, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`,
        [paymentStatus, newStatus, order.id]
      );

      // Add to timeline
      await client.query(
        `INSERT INTO order_timeline (order_id, status, description) 
         VALUES ($1, $2, $3)`,
        [order.id, newStatus, timelineDescription]
      );

      // Create notification for user
      if (paymentStatus === 'paid') {
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type) 
           VALUES ($1, $2, $3, $4)`,
          [
            order.user_id,
            'Pembayaran Berhasil',
            `Pembayaran untuk pesanan ${order.order_number} telah berhasil`,
            'payment'
          ]
        );
      }
    });

    res.status(200).json({
      success: true,
      message: 'Notification processed'
    });
  } catch (error) {
    console.error('Midtrans notification error:', error);
    next(error);
  }
};

// @desc    Check Midtrans transaction status and update database
// @route   GET /api/payments/midtrans/status/:orderNumber
// @access  Private
exports.checkMidtransStatus = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    
    console.log(`🔍 Checking payment status for order: ${orderNumber}`);

    // Get order from database first
    const orderResult = await query(
      'SELECT * FROM orders WHERE order_number = $1',
      [orderNumber]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    const order = orderResult.rows[0];
    
    // If already paid, return success
    if (order.payment_status === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Pesanan sudah dibayar',
        data: {
          transaction_status: 'settlement',
          payment_status: 'paid',
          database_updated: false,
          already_paid: true
        }
      });
    }

    // Check transaction status from Midtrans
    let statusResponse;
    try {
      statusResponse = await coreApi.transaction.status(orderNumber);
      console.log(`📊 Midtrans status for ${orderNumber}:`, statusResponse.transaction_status);
    } catch (midtransError) {
      console.error(`❌ Midtrans API error:`, midtransError.message);
      return res.status(200).json({
        success: false,
        message: 'Transaksi belum ditemukan di Midtrans. Silakan lakukan pembayaran terlebih dahulu.',
        data: {
          transaction_status: 'not_found',
          payment_status: order.payment_status
        }
      });
    }

    // Update order status based on Midtrans response
    let paymentStatus = order.payment_status;
    let orderStatus = order.status;
    let databaseUpdated = false;
    
    if (statusResponse.transaction_status === 'settlement' || statusResponse.transaction_status === 'capture') {
      console.log(`✅ Payment successful! Updating database...`);
      
      paymentStatus = 'paid';
      orderStatus = 'scheduled'; // Use 'scheduled' instead of 'confirmed'
      databaseUpdated = true;
      
      // Update in database
      await transaction(async (client) => {
        // Update order
        await client.query(
          `UPDATE orders 
           SET payment_status = 'paid', 
               status = 'scheduled', 
               updated_at = CURRENT_TIMESTAMP 
           WHERE id = $1`,
          [order.id]
        );

        // Check if payment record exists
        const existingPayment = await client.query(
          `SELECT id FROM payments WHERE order_id = $1 AND transaction_id = $2`,
          [order.id, statusResponse.transaction_id]
        );

        if (existingPayment.rows.length === 0) {
          // Insert new payment record
          await client.query(
            `INSERT INTO payments (order_id, payment_method, amount, status, transaction_id, paid_at) 
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
            [
              order.id,
              statusResponse.payment_type || 'midtrans',
              statusResponse.gross_amount,
              'success',
              statusResponse.transaction_id
            ]
          );
        } else {
          // Update existing payment
          await client.query(
            `UPDATE payments 
             SET status = 'success', 
                 paid_at = CURRENT_TIMESTAMP,
                 payment_method = $1,
                 amount = $2
             WHERE order_id = $3 AND transaction_id = $4`,
            [
              statusResponse.payment_type || 'midtrans',
              statusResponse.gross_amount,
              order.id,
              statusResponse.transaction_id
            ]
          );
        }

        // Check if timeline entry already exists
        const existingTimeline = await client.query(
          `SELECT id FROM order_timeline WHERE order_id = $1 AND status = 'scheduled' AND description LIKE '%Pembayaran berhasil%'`,
          [order.id]
        );

        if (existingTimeline.rows.length === 0) {
          // Add to timeline
          await client.query(
            `INSERT INTO order_timeline (order_id, status, description) 
             VALUES ($1, $2, $3)`,
            [order.id, 'scheduled', 'Pembayaran berhasil dikonfirmasi via Midtrans']
          );
        }

        // Check if notification already exists
        const existingNotif = await client.query(
          `SELECT id FROM notifications WHERE user_id = $1 AND type = 'payment' AND message LIKE $2`,
          [order.user_id, `%${order.order_number}%`]
        );

        if (existingNotif.rows.length === 0) {
          // Create notification
          await client.query(
            `INSERT INTO notifications (user_id, title, message, type) 
             VALUES ($1, $2, $3, $4)`,
            [order.user_id, 'Pembayaran Berhasil', `Pembayaran untuk pesanan ${order.order_number} telah berhasil`, 'payment']
          );
        }
      });
      
      console.log(`✅ Order ${orderNumber} successfully updated to PAID & SCHEDULED`);
    } else if (statusResponse.transaction_status === 'pending') {
      console.log(`⏳ Payment still pending for ${orderNumber}`);
    }

    res.status(200).json({
      success: true,
      message: databaseUpdated ? 'Status pembayaran berhasil diperbarui' : 'Status pembayaran masih ' + statusResponse.transaction_status,
      data: {
        transaction_status: statusResponse.transaction_status,
        payment_type: statusResponse.payment_type,
        payment_status: paymentStatus,
        order_status: orderStatus,
        database_updated: databaseUpdated,
        gross_amount: statusResponse.gross_amount
      }
    });
  } catch (error) {
    console.error('❌ Midtrans status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengecek status pembayaran: ' + error.message
    });
  }
};

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { order_id, payment_method, transaction_id } = req.body;
    const user_id = req.user.id;

    // Verify order belongs to user
    const orderResult = await query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [order_id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    const order = orderResult.rows[0];

    if (order.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Pesanan sudah dibayar'
      });
    }

    // Create payment record in transaction
    const result = await transaction(async (client) => {
      // Insert payment
      const paymentResult = await client.query(
        `INSERT INTO payments (order_id, payment_method, amount, status, transaction_id, paid_at) 
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [order_id, payment_method, order.total_price, 'success', transaction_id]
      );

      // Update order payment status
      await client.query(
        `UPDATE orders 
         SET payment_status = 'paid', 
             status = 'confirmed', 
             payment_method = $1,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [payment_method, order_id]
      );

      // Add to timeline
      await client.query(
        `INSERT INTO order_timeline (order_id, status, description) 
         VALUES ($1, $2, $3)`,
        [order_id, 'confirmed', 'Pembayaran berhasil, pesanan dikonfirmasi']
      );

      // Create notification
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type) 
         VALUES ($1, $2, $3, $4)`,
        [user_id, 'Pembayaran Berhasil', `Pembayaran untuk pesanan ${order.order_number} berhasil`, 'payment']
      );

      return paymentResult.rows[0];
    });

    res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil diproses',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload payment proof
// @route   POST /api/payments/upload-proof
// @access  Private
exports.uploadPaymentProof = async (req, res, next) => {
  try {
    const { order_id, payment_proof_url } = req.body;
    const user_id = req.user.id;

    // Verify order belongs to user
    const orderResult = await query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [order_id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    const order = orderResult.rows[0];

    // Create payment record with proof
    const result = await transaction(async (client) => {
      const paymentResult = await client.query(
        `INSERT INTO payments (order_id, payment_method, amount, status, payment_proof_url) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [order_id, order.payment_method || 'transfer', order.total_price, 'pending', payment_proof_url]
      );

      // Update order status
      await client.query(
        `UPDATE orders 
         SET status = 'awaiting_confirmation', 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [order_id]
      );

      // Add to timeline
      await client.query(
        `INSERT INTO order_timeline (order_id, status, description) 
         VALUES ($1, $2, $3)`,
        [order_id, 'awaiting_confirmation', 'Bukti pembayaran telah diunggah, menunggu verifikasi']
      );

      return paymentResult.rows[0];
    });

    res.status(200).json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment (Admin)
// @route   PUT /api/payments/:id/verify
// @access  Private/Admin
exports.verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const result = await transaction(async (client) => {
      // Get payment info
      const paymentResult = await client.query(
        'SELECT * FROM payments WHERE id = $1',
        [id]
      );

      if (paymentResult.rows.length === 0) {
        throw new Error('Payment tidak ditemukan');
      }

      const payment = paymentResult.rows[0];

      // Update payment status
      const newStatus = is_approved ? 'success' : 'failed';
      await client.query(
        `UPDATE payments 
         SET status = $1, paid_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [newStatus, id]
      );

      // Get order info
      const orderResult = await client.query(
        'SELECT * FROM orders WHERE id = $1',
        [payment.order_id]
      );

      const order = orderResult.rows[0];

      if (is_approved) {
        // Update order if approved
        await client.query(
          `UPDATE orders 
           SET payment_status = 'paid', 
               status = 'confirmed', 
               updated_at = CURRENT_TIMESTAMP 
           WHERE id = $1`,
          [payment.order_id]
        );

        // Add to timeline
        await client.query(
          `INSERT INTO order_timeline (order_id, status, description) 
           VALUES ($1, $2, $3)`,
          [payment.order_id, 'confirmed', 'Pembayaran telah diverifikasi, pesanan dikonfirmasi']
        );

        // Create notification
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type) 
           VALUES ($1, $2, $3, $4)`,
          [order.user_id, 'Pembayaran Diverifikasi', `Pembayaran untuk pesanan ${order.order_number} telah diverifikasi`, 'payment']
        );
      } else {
        // Update order if rejected
        await client.query(
          `UPDATE orders 
           SET status = 'payment_rejected', 
               updated_at = CURRENT_TIMESTAMP 
           WHERE id = $1`,
          [payment.order_id]
        );

        // Add to timeline
        await client.query(
          `INSERT INTO order_timeline (order_id, status, description) 
           VALUES ($1, $2, $3)`,
          [payment.order_id, 'payment_rejected', 'Pembayaran ditolak, silakan upload bukti pembayaran yang valid']
        );

        // Create notification
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type) 
           VALUES ($1, $2, $3, $4)`,
          [order.user_id, 'Pembayaran Ditolak', `Pembayaran untuk pesanan ${order.order_number} ditolak, silakan upload ulang`, 'payment']
        );
      }

      return payment;
    });

    res.status(200).json({
      success: true,
      message: is_approved ? 'Pembayaran berhasil diverifikasi' : 'Pembayaran ditolak',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment by order
// @route   GET /api/payments/order/:orderId
// @access  Private
exports.getPaymentByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const user_id = req.user.id;

    // Verify order belongs to user
    const orderResult = await query(
      'SELECT id FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    const result = await query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC',
      [orderId]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};
