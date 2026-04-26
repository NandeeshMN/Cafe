import express from 'express';
import { getOrders, placeOrder, updateOrderStatus, getOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', placeOrder); // public
router.get('/status/:order_number', getOrderStatus); // public
router.post('/cancel/:order_number', cancelOrder); // public

router.get('/', verifyToken, getOrders);
router.put('/:id', verifyToken, updateOrderStatus);

export default router;
