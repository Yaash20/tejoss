// Generate admin password hash
const bcrypt = require('bcryptjs');

const password = 'admin123'; // Ganti dengan password yang kamu mau

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('\n=================================');
    console.log('Admin Password Hash:');
    console.log('=================================');
    console.log(hash);
    console.log('\nCopy hash di atas dan run SQL query:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@tejoss.com';`);
    console.log('=================================\n');
  })
  .catch(err => console.error(err));
