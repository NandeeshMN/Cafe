import express from 'express';
import { loginAdmin, sendOTP, verifyOTP, resetPassword, forceOTP } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/force-otp', forceOTP); // Debug route

export default router;
