import db from './config/db.js';

const migrate = async () => {
  try {
    console.log('Starting OTP migration...');

    const [columns] = await db.query('SHOW COLUMNS FROM admin');
    const cols = columns.map(c => c.Field);

    // Add otp columns
    if (!cols.includes('otp')) {
      await db.query('ALTER TABLE admin ADD COLUMN otp VARCHAR(10) DEFAULT NULL');
      console.log('✔ Added otp column.');
    } else {
      console.log('ℹ otp column already exists.');
    }

    if (!cols.includes('otp_expiry')) {
      await db.query('ALTER TABLE admin ADD COLUMN otp_expiry DATETIME DEFAULT NULL');
      console.log('✔ Added otp_expiry column.');
    } else {
      console.log('ℹ otp_expiry column already exists.');
    }

    // Clean up old token columns if they exist
    if (cols.includes('reset_token')) {
      await db.query('ALTER TABLE admin DROP COLUMN reset_token');
      console.log('✔ Removed old reset_token column.');
    }
    if (cols.includes('reset_token_expiry')) {
      await db.query('ALTER TABLE admin DROP COLUMN reset_token_expiry');
      console.log('✔ Removed old reset_token_expiry column.');
    }

    console.log('\n✅ OTP migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
