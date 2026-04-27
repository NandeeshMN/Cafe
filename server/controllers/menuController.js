import db from '../config/db.js';

export const getMenu = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM menu');
    const rows = result.rows;
    console.log('--- GET MENU DEBUG (PostgreSQL) ---');
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
    const result = await db.query(
      'INSERT INTO menu (name, category, price, image, description) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, category, price, image, description]
    );
    res.status(201).json({ 
      id: result.rows[0].id, 
      name, 
      category, 
      price, 
      image, 
      description 
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Error adding menu item' });
  }
};

export const editMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, image, description } = req.body;
  try {
    await db.query(
      'UPDATE menu SET name=$1, category=$2, price=$3, image=$4, description=$5 WHERE id=$6',
      [name, category, price, image, description, id]
    );
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item' });
  }
};

export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM menu WHERE id=$1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
};
