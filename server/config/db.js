import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cafe_db',
  port: process.env.DB_PORT || 5432,
  // Production ready: support SSL for Render/Railway if needed
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// To keep logic unchanged in controllers, we can add a wrapper 
// but it's better to update controllers to handle pg's result format.
// I will export the pool as is.

export default pool;
