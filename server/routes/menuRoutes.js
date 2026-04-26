import express from 'express';
import { getMenu, addMenuItem, editMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMenu); // public route
router.post('/', verifyToken, addMenuItem);
router.put('/:id', verifyToken, editMenuItem);
router.delete('/:id', verifyToken, deleteMenuItem);

export default router;
