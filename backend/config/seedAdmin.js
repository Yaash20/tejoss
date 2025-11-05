const { pool } = require('./database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdminUser = async () => {
  try {
    console.log('🔐 Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@tejoss.id']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@tejoss.id');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert admin user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role, is_verified) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        'Administrator Tejoss',
        'admin@tejoss.id',
        hashedPassword,
        '+62 812-3456-7890',
        'admin',
        true
      ]
    );

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Email: admin@tejoss.id');
    console.log('   Password: admin123');
    console.log('\n⚠️  PENTING: Ganti password ini setelah login pertama kali!\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    pool.end();
  }
};

// Run if called directly
if (require.main === module) {
  seedAdminUser();
}

module.exports = { seedAdminUser };
