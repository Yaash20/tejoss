const { query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TJ-${timestamp}-${random}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { service_id, quantity, location, schedule_date, notes, payment_method } = req.body;
    const user_id = req.user.id;

    // Get service details
    const serviceResult = await query(
      'SELECT name, price, unit FROM services WHERE id = $1 AND is_active = true',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service tidak ditemukan'
      });
    }

    const service = serviceResult.rows[0];
    const total_price = service.price * quantity;
    const order_number = generateOrderNumber();

    // Create order and timeline in transaction
    const result = await transaction(async (client) => {
      // Insert order
      const orderResult = await client.query(
        `INSERT INTO orders 
         (order_number, user_id, service_id, service_name, quantity, unit, total_price, 
          location, schedule_date, notes, payment_method, status, payment_status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
         RETURNING *`,
        [order_number, user_id, service_id, service.name, quantity, service.unit, 
         total_price, location, schedule_date, notes, payment_method, 'pending', 'unpaid']
      );

      const order = orderResult.rows[0];

      // Insert initial timeline
      await client.query(
        `INSERT INTO order_timeline (order_id, status, description) 
         VALUES ($1, $2, $3)`,
        [order.id, 'pending', 'Pesanan dibuat dan menunggu pembayaran']
      );

      // Create notification for user
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type) 
         VALUES ($1, $2, $3, $4)`,
        [user_id, 'Pesanan Baru', `Pesanan ${order_number} berhasil dibuat`, 'order']
      );

      return order;
    });

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for user (or all orders for admin)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { status, payment_status, search } = req.query;
    const user_id = req.user.id;
    const user_role = req.user.role;

    let queryText;
    let params = [];
    let paramCount = 1;

    // Admin sees ALL orders with customer info, regular user sees only their orders
    if (user_role === 'admin') {
      queryText = `
        SELECT o.*, 
               u.name as customer_name, 
               u.phone as customer_phone, 
               u.email as customer_email 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id
        WHERE 1=1
      `;
    } else {
      queryText = 'SELECT * FROM orders WHERE user_id = $1';
      params.push(user_id);
      paramCount++;
    }

    if (status) {
      queryText += ` AND o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (payment_status) {
      queryText += ` AND o.payment_status = $${paramCount}`;
      params.push(payment_status);
      paramCount++;
    }

    if (search) {
      if (user_role === 'admin') {
        queryText += ` AND (o.order_number ILIKE $${paramCount} OR o.service_name ILIKE $${paramCount} OR o.location ILIKE $${paramCount})`;
      } else {
        queryText += ` AND (order_number ILIKE $${paramCount} OR service_name ILIKE $${paramCount})`;
      }
      params.push(`%${search}%`);
      paramCount++;
    }

    queryText += user_role === 'admin' ? ' ORDER BY o.created_at DESC' : ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    // Get timeline for each order
    const ordersWithTimeline = await Promise.all(
      result.rows.map(async (order) => {
        const timelineResult = await query(
          'SELECT * FROM order_timeline WHERE order_id = $1 ORDER BY created_at ASC',
          [order.id]
        );
        return {
          ...order,
          timeline: timelineResult.rows
        };
      })
    );

    res.status(200).json({
      success: true,
      count: ordersWithTimeline.length,
      data: ordersWithTimeline
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get order
    const orderResult = await query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    const order = orderResult.rows[0];

    // Get timeline
    const timelineResult = await query(
      'SELECT * FROM order_timeline WHERE order_id = $1 ORDER BY created_at ASC',
      [id]
    );

    // Get payment info
    const paymentResult = await query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...order,
        timeline: timelineResult.rows,
        payment: paymentResult.rows[0] || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats/dashboard
// @access  Private
exports.getOrderStats = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // Get total orders by status
    const statusResult = await query(
      `SELECT status, COUNT(*) as count 
       FROM orders 
       WHERE user_id = $1 
       GROUP BY status`,
      [user_id]
    );

    // Get total spending
    const spendingResult = await query(
      `SELECT COALESCE(SUM(total_price), 0) as total_spending 
       FROM orders 
       WHERE user_id = $1 AND payment_status = 'paid'`,
      [user_id]
    );

    // Get recent orders
    const recentResult = await query(
      `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      data: {
        statusCounts: statusResult.rows,
        totalSpending: parseFloat(spendingResult.rows[0].total_spending),
        recentOrders: recentResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin/System)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const result = await transaction(async (client) => {
      // Update order status
      const orderResult = await client.query(
        `UPDATE orders 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [status, id]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Pesanan tidak ditemukan');
      }

      const order = orderResult.rows[0];

      // Add to timeline
      await client.query(
        `INSERT INTO order_timeline (order_id, status, description) 
         VALUES ($1, $2, $3)`,
        [id, status, description || `Status diubah menjadi ${status}`]
      );

      // Create notification
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type) 
         VALUES ($1, $2, $3, $4)`,
        [order.user_id, 'Update Pesanan', `Pesanan ${order.order_number}: ${description || status}`, 'order']
      );

      return order;
    });

    res.status(200).json({
      success: true,
      message: 'Status pesanan berhasil diupdate',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await transaction(async (client) => {
      // Check if order can be cancelled
      const orderResult = await client.query(
        'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
        [id, user_id]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Pesanan tidak ditemukan');
      }

      const order = orderResult.rows[0];

      if (order.status === 'completed' || order.status === 'cancelled') {
        throw new Error('Pesanan tidak dapat dibatalkan');
      }

      // Update status to cancelled
      const updateResult = await client.query(
        `UPDATE orders 
         SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [id]
      );

      // Add to timeline
      await client.query(
        `INSERT INTO order_timeline (order_id, status, description) 
         VALUES ($1, $2, $3)`,
        [id, 'cancelled', 'Pesanan dibatalkan oleh pelanggan']
      );

      return updateResult.rows[0];
    });

    res.status(200).json({
      success: true,
      message: 'Pesanan berhasil dibatalkan',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
