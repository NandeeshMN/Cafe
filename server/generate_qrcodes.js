import db from './config/db.js';
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

const generateQRCodes = async () => {
  try {
    const localIp = getLocalIp();
    const port = 5173; // Vite default port, or 3000 if that's what user prefers. 
    // The user said "http://<LOCAL_IP>:3000/menu?tableId=<id>"
    const baseUrl = `http://${localIp}:3000`; 

    console.log(`Generating QR codes with base URL: ${baseUrl}`);

    const [tables] = await db.query('SELECT id, table_number FROM tables');

    for (const table of tables) {
      const qrUrl = `${baseUrl}/menu?tableId=${table.id}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl);
      
      await db.query('UPDATE tables SET qr_code = ? WHERE id = ?', [qrDataUrl, table.id]);
      console.log(`QR Code generated for Table ${table.table_number} (ID: ${table.id})`);
    }

    console.log('All QR codes generated and saved to database.');
    process.exit(0);
  } catch (error) {
    console.error('Error generating QR codes:', error);
    process.exit(1);
  }
};

generateQRCodes();
