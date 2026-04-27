import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
dotenv.config();

// ─── Nodemailer / Brevo SMTP ────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ [DEBUG] SMTP connection failed:', error.message);
  } else {
    console.log('✅ [DEBUG] SMTP ready — sender:', process.env.BREVO_SENDER_EMAIL);
  }
});

// ─── Helper: generate 6-digit OTP ───────────────────────────────────────────
const generateOTP = () => {
  const bytes = crypto.randomBytes(3);
  return String(100000 + (bytes.readUIntBE(0, 3) % 900000));
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log(`[DEBUG] Login attempt for: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await db.query('SELECT * FROM admin WHERE LOWER(email) = LOWER($1)', [email]);

    if (result.rows.length === 0) {
      console.log(`[DEBUG] Login failed: User ${email} not found`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.log(`[DEBUG] Login failed: Incorrect password for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    console.log(`[DEBUG] Login success: ${email}`);
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('[DEBUG] Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ─── SEND OTP ─────────────────────────────────────────────────────────────────
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  console.log(`\n🚀 [DEBUG] OTP route hit for: ${email}`);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const GENERIC_MSG = 'If an account with that email exists, an OTP has been sent.';

  try {
    // 1. Check user exists (Case-insensitive)
    console.log(`[DEBUG] Querying database for user: ${email}`);
    const result = await db.query('SELECT * FROM admin WHERE LOWER(email) = LOWER($1)', [email]);
    console.log(`[DEBUG] Query result rows: ${result.rows.length}`);

    if (result.rows.length === 0) {
      console.warn(`[DEBUG] User NOT found in database. Returning generic success.`);
      return res.status(200).json({ message: GENERIC_MSG });
    }

    const admin = result.rows[0];
    console.log(`[DEBUG] User found: ID ${admin.id}, DB Email: ${admin.email}`);

    // 2. Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    console.log(`[DEBUG] Generated OTP: ${otp} (Expires: ${otpExpiry.toISOString()})`);

    // 3. Update DB
    console.log(`[DEBUG] Updating database with OTP...`);
    await db.query(
      'UPDATE admin SET otp = $1, otp_expiry = $2 WHERE id = $3',
      [otp, otpExpiry, admin.id]
    );
    console.log(`[DEBUG] DB update successful.`);

    // 4. Prepare Email
    const mailOptions = {
      from: `"Cafe Admin" <${process.env.BREVO_SENDER_EMAIL}>`,
      to: admin.email, // Use DB email to ensure correct casing
      subject: 'Your OTP for Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;
                    padding: 32px; border: 1px solid #e0d6cc; border-radius: 12px;
                    background: #faf9f6;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px;">☕</span>
            <h2 style="color: #3e2723; margin: 8px 0 0;">Cafe Admin</h2>
          </div>
          <h3 style="color: #5a3a22; text-align: center;">Password Reset OTP</h3>
          <p style="color: #555; font-size: 15px;">
            You requested a password reset. Use the OTP below to proceed.
            It expires in <strong>10 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <span style="display: inline-block; background: #5a3a22; color: #fff;
                         font-size: 34px; font-weight: bold; letter-spacing: 10px;
                         padding: 16px 32px; border-radius: 10px;">
              ${otp}
            </span>
          </div>
        </div>
      `,
    };

    // 5. Send Email
    console.log(`[DEBUG] Calling sendMail to: ${admin.email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [DEBUG] sendMail successful! MessageID: ${info.messageId}`);

    res.status(200).json({ message: GENERIC_MSG });
  } catch (error) {
    console.error('❌ [DEBUG] Send OTP Failure:');
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    res.status(500).json({ message: 'Error processing request. Please try again.' });
  }
};

// ─── FORCE OTP (DEBUG ONLY) ──────────────────────────────────────────────────
export const forceOTP = async (req, res) => {
  const { email } = req.body;
  console.log(`\n🛠️ [DEBUG] FORCE-OTP triggered for: ${email}`);

  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const mailOptions = {
      from: `"Cafe Debug" <${process.env.BREVO_SENDER_EMAIL}>`,
      to: email,
      subject: 'DEBUG: Force SMTP Test',
      text: `This is a direct SMTP test for ${email}. Time: ${new Date().toISOString()}`,
    };

    console.log(`[DEBUG] Sending force test email...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [DEBUG] Force email sent: ${info.messageId}`);
    
    res.json({ success: true, messageId: info.messageId, response: info.response });
  } catch (error) {
    console.error(`❌ [DEBUG] Force OTP Failed:`, error.message);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

// ─── VERIFY OTP ──────────────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log(`[DEBUG] Verifying OTP for: ${email}`);

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM admin WHERE LOWER(email) = LOWER($1) AND otp = $2 AND otp_expiry > NOW()',
      [email, otp]
    );

    if (result.rows.length === 0) {
      console.log(`[DEBUG] OTP verification failed: Invalid/Expired for ${email}`);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log(`[DEBUG] OTP verified successfully for ${email}`);
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('[DEBUG] Verify OTP error:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log(`[DEBUG] Password reset attempt for: ${email}`);

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM admin WHERE LOWER(email) = LOWER($1) AND otp = $2 AND otp_expiry > NOW()',
      [email, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const admin = result.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE admin SET password = $1, otp = NULL, otp_expiry = NULL WHERE id = $2',
      [hashedPassword, admin.id]
    );

    console.log(`[DEBUG] Password reset successful for ${email}`);
    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('[DEBUG] Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
