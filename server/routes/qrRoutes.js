import express from 'express';
import { generateSmallQRSheet } from '../controllers/qrController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/generate-small', verifyToken, generateSmallQRSheet);

export default router;
