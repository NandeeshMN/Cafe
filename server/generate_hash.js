import bcrypt from 'bcryptjs';

const password = 'neha150703'; // The plain text password from your logs
const saltRounds = 10;

console.log('Generating hash for:', password);

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('\n--- HASH GENERATOR SUCCESS ---');
  console.log('Plain Password:', password);
  console.log('New Bcrypt Hash:', hash);
  console.log('------------------------------\n');
  console.log('SQL UPDATE QUERY:');
  console.log(`UPDATE admin SET password = '${hash}' WHERE email = 'nehasidnal15.mca@gmail.com';`);
});
