import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import db from '../config/db.js';
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

export const generateSmallQRSheet = async (req, res) => {
  try {
    const [tables] = await db.query('SELECT * FROM tables ORDER BY table_number ASC');
    
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const localIp = getLocalIp();
    const baseUrl = `http://${localIp}:3000`; // Customer frontend port

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compact-qrs.pdf');
    
    doc.pipe(res);

    // Title
    doc.font('Helvetica-Bold').fontSize(20).text('Cafe QR Codes - Compact Sheet', { align: 'center' });
    doc.moveDown(2);

    // Grid Specs
    const columns = 4;
    const margin = 40;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const availableWidth = pageWidth - (margin * 2);
    const cellWidth = availableWidth / columns;
    const cellHeight = 140;
    const qrSize = 100;

    let x = margin;
    let y = 100;
    let count = 0;

    for (const table of tables) {
      if (count > 0 && count % columns === 0) {
        x = margin;
        y += cellHeight;
      }

      // Check for new page
      if (y + cellHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
        x = margin;
      }

      const qrUrl = `${baseUrl}/menu?tableId=${table.id}`;
      const qrBuffer = await QRCode.toBuffer(qrUrl, { margin: 1, width: 200 });

      // Draw QR Code
      const qrX = x + (cellWidth - qrSize) / 2;
      doc.image(qrBuffer, qrX, y, { width: qrSize });

      // Draw Label
      doc.font('Helvetica').fontSize(10).fillColor('#333')
        .text(`Table ${table.table_number}`, x, y + qrSize + 5, {
          width: cellWidth,
          align: 'center'
        });

      x += cellWidth;
      count++;
    }

    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};
