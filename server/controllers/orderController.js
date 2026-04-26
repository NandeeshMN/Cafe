import db from '../config/db.js';

export const getOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, t.table_number 
      FROM orders o 
      JOIN tables t ON o.table_id = t.id 
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const placeOrder = async (req, res) => {
  const { table_id, items, total_amount } = req.body;
  const order_number = '#AC-' + Math.floor(100000 + Math.random() * 900000);
  
  try {
    // Validate table exists
    const [tableRows] = await db.query('SELECT id FROM tables WHERE id = ?', [table_id]);
    if (tableRows.length === 0) {
      return res.status(400).json({ message: 'Invalid table ID. Order rejected.' });
    }

    const [result] = await db.query(
      'INSERT INTO orders (order_number, table_id, items_json, total_amount, status) VALUES (?, ?, ?, ?, ?)',
      [order_number, table_id, JSON.stringify(items), total_amount, 'Pending']
    );
    res.status(201).json({ id: result.insertId, order_number, status: 'Pending' });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status=? WHERE id=?', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

export const getOrderStatus = async (req, res) => {
  const { order_number } = req.params;
  try {
    const [rows] = await db.query('SELECT status, cancellation_reason FROM orders WHERE order_number=?', [order_number]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching status' });
  }
};

export const cancelOrder = async (req, res) => {
  const { order_number } = req.params;
  const { reason } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE orders SET status = "Cancelled", cancellation_reason = ? WHERE order_number = ? AND status = "Pending"',
      [reason, order_number]
    );
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Order cannot be cancelled (might not be pending)' });
    }
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order' });
  }
};
