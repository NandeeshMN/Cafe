import db from '../config/db.js';
import QRCode from 'qrcode';
import os from 'os';

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

export const getTables = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tables ORDER BY table_number ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables' });
  }
};

export const addTable = async (req, res) => {
  const { table_number } = req.body;
  if (!table_number) {
    return res.status(400).json({ message: 'Table number is required' });
  }

  try {
    const [result] = await db.query('INSERT INTO tables (table_number) VALUES (?)', [table_number]);
    const [newTable] = await db.query('SELECT * FROM tables WHERE id = ?', [result.insertId]);
    res.status(201).json(newTable[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Table number already exists' });
    }
    res.status(500).json({ message: 'Error adding table' });
  }
};

export const getTableQRCode = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT id FROM tables WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const localIp = getLocalIp();
    const port = 3000; // Customer frontend port
    const qrUrl = `http://${localIp}:${port}/menu?tableId=${id}`;
    
    const qrImage = await QRCode.toBuffer(qrUrl, {
      type: 'png',
      margin: 1,
      width: 300
    });

    res.setHeader('Content-Type', 'image/png');
    res.send(qrImage);
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code' });
  }
};
