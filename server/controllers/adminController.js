import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  console.log('--- LOGIN DEBUG ---');
  console.log('Entered Email:', email);

  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
    
    console.log('DB Result Rows:', rows.length);

    if (rows.length === 0) {
      console.log('User not found in DB');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = rows[0];
    console.log('Stored Hashed Password:', admin.password);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Bcrypt Comparison Result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    console.log('Login Successful, token generated');
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
