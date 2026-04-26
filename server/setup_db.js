import db from './config/db.js';
import bcrypt from 'bcryptjs';

const setup = async () => {
  try {
    // We assume cafe_db is already created or create it:
    // await db.query('CREATE DATABASE IF NOT EXISTS cafe_db');
    // await db.query('USE cafe_db');

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(1000) DEFAULT '',
        description TEXT
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_number INT UNIQUE NOT NULL,
        qr_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        table_id INT NOT NULL,
        items_json JSON NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('Pending', 'Preparing', 'Ready', 'Served', 'Cancelled') DEFAULT 'Pending',
        cancellation_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (table_id) REFERENCES tables(id)
      )
    `);

    // Insert an admin if not exists
    const [admins] = await db.query('SELECT * FROM admin');
    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query('INSERT INTO admin (email, password) VALUES (?, ?)', ['admin@cafe.com', hashedPassword]);
      console.log('Admin inserted: admin@cafe.com / admin123');
    }

    // Insert mock menu if not exists
    const [menu] = await db.query('SELECT * FROM menu');
    if (menu.length === 0) {
      await db.query(`
        INSERT INTO menu (name, category, price, image, description) VALUES 
        ('Double Espresso', 'Beverages', 4.50, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80', 'Boffee Work'),
        ('Oat Milk Latte', 'Beverages', 5.75, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80', 'Standard Size, Extra Hot'),
        ('Avocado Toast', 'Fast Food', 12.50, 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80', 'Freshly Baked')
      `);
      console.log('Mock menu inserted');
    }

    // Insert mock tables if not exists
    const [tables] = await db.query('SELECT * FROM tables');
    if (tables.length === 0) {
      await db.query('INSERT INTO tables (table_number) VALUES (1), (2), (3), (4)');
      console.log('Mock tables inserted: 1, 2, 3, 4');
    }

    console.log('Database setup complete');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setup();
