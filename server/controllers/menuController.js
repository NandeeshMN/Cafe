import db from '../config/db.js';

export const getMenu = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu');
    console.log('--- GET MENU DEBUG ---');
    console.log('Items found:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Error fetching menu' });
  }
};

export const addMenuItem = async (req, res) => {
  const { name, category, price, image, description } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO menu (name, category, price, image, description) VALUES (?, ?, ?, ?, ?)',
      [name, category, price, image, description]
    );
    res.status(201).json({ id: result.insertId, name, category, price, image, description });
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item' });
  }
};

export const editMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, image, description } = req.body;
  try {
    await db.query(
      'UPDATE menu SET name=?, category=?, price=?, image=?, description=? WHERE id=?',
      [name, category, price, image, description, id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item' });
  }
};

export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM menu WHERE id=?', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item' });
  }
};
