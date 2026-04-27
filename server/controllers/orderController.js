import db from '../config/db.js';

export const getOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, t.table_number 
      FROM orders o 
      JOIN tables t ON o.table_id = t.id 
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const placeOrder = async (req, res) => {
  const { table_id, items, total_amount } = req.body;
  const order_number = '#AC-' + Math.floor(100000 + Math.random() * 900000);
  
  try {
    // Validate table exists
    const tableResult = await db.query('SELECT id FROM tables WHERE id = $1', [table_id]);
    if (tableResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid table ID. Order rejected.' });
    }

    const result = await db.query(
      'INSERT INTO orders (order_number, table_id, items_json, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [order_number, table_id, JSON.stringify(items), total_amount, 'Pending']
    );
    res.status(201).json({ id: result.rows[0].id, order_number, status: 'Pending' });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status=$1 WHERE id=$2', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Error updating status' });
  }
};

export const getOrderStatus = async (req, res) => {
  const { order_number } = req.params;
  try {
    const result = await db.query('SELECT status, cancellation_reason FROM orders WHERE order_number=$1', [order_number]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ message: 'Error fetching status' });
  }
};

export const cancelOrder = async (req, res) => {
  const { order_number } = req.params;
  const { reason } = req.body;
  try {
    const result = await db.query(
      'UPDATE orders SET status = \'Cancelled\', cancellation_reason = $1 WHERE order_number = $2 AND status = \'Pending\'',
      [reason, order_number]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Order cannot be cancelled (might not be pending)' });
    }
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};
