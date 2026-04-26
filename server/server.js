import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import qrRoutes from './routes/qrRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/qr', qrRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Cafe API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\x1b[32m✔ Server running on port ${PORT}\x1b[0m`);
  console.log(`\x1b[36mℹ http://localhost:${PORT}\x1b[0m`);
});
