import express from 'express';
import { getTables, addTable, getTableQRCode } from '../controllers/tableController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getTables);
router.post('/', verifyToken, addTable);
router.get('/:id/qrcode', getTableQRCode); // Publicly accessible image

export default router;
