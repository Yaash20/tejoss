/**
 * Test Database Connection Script
 * 
 * Script ini untuk test koneksi database Supabase PostgreSQL
 * Jalankan: node test-connection.js
 */

require('dotenv').config();
const { Pool } = require('pg');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Main test function
async function testConnection() {
  log.title('═══════════════════════════════════════');
  log.title('  TEJOSS - DATABASE CONNECTION TEST');
  log.title('═══════════════════════════════════════');

  // Step 1: Check environment variables
  log.title('📋 Step 1: Checking Environment Variables');
  
  const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
  ];

  let missingVars = [];
  
  console.log('');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      log.error(`${varName}: NOT SET`);
      missingVars.push(varName);
    } else {
      if (varName === 'DB_PASSWORD') {
        log.success(`${varName}: ${'*'.repeat(value.length)} (hidden)`);
      } else {
        log.success(`${varName}: ${value}`);
      }
    }
  });

  if (missingVars.length > 0) {
    console.log('');
    log.error('Missing environment variables!');
    log.warn('Please create /backend/.env file and set all variables.');
    log.info('Example: copy .env.template to .env and fill in the values.');
    process.exit(1);
  }

  // Step 2: Create connection pool
  log.title('🔌 Step 2: Creating Connection Pool');
  
  let pool;
  try {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 1,
      connectionTimeoutMillis: 5000,
    });
    log.success('Connection pool created');
  } catch (error) {
    log.error(`Failed to create pool: ${error.message}`);
    process.exit(1);
  }

  // Step 3: Test connection
  log.title('🔍 Step 3: Testing Connection');
  
  try {
    log.info('Attempting to connect...');
    const client = await pool.connect();
    log.success('Connected to database!');
    
    // Test query
    log.info('Running test query: SELECT NOW()');
    const result = await client.query('SELECT NOW() as current_time');
    log.success(`Query successful! Current time: ${result.rows[0].current_time}`);
    
    client.release();
  } catch (error) {
    log.error(`Connection failed: ${error.message}`);
    
    console.log('');
    log.title('🔧 Troubleshooting Tips:');
    console.log('');
    log.warn('1. Check if DB_PASSWORD is correct');
    log.warn('2. Verify Supabase project is active (not paused)');
    log.warn('3. Check internet connection');
    log.warn('4. Verify DB_HOST and other credentials from Supabase dashboard');
    log.warn('5. Try resetting database password in Supabase Settings > Database');
    
    await pool.end();
    process.exit(1);
  }

  // Step 4: Test tables
  log.title('📊 Step 4: Checking Database Tables');
  
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (result.rows.length === 0) {
      log.warn('No tables found in database!');
      log.info('You may need to run migrations: /supabase/migrations.sql');
    } else {
      log.success(`Found ${result.rows.length} tables:`);
      result.rows.forEach(row => {
        console.log(`  ${colors.cyan}•${colors.reset} ${row.table_name}`);
      });
    }
  } catch (error) {
    log.error(`Failed to check tables: ${error.message}`);
  }

  // Step 5: Test services data
  log.title('🛠️  Step 5: Checking Services Data');
  
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM services');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      log.warn('No services found in database!');
      log.info('You may need to run seed: /supabase/seed-services.sql');
    } else {
      log.success(`Found ${count} services in database`);
      
      // Get service names
      const servicesResult = await pool.query('SELECT name FROM services ORDER BY id');
      console.log('');
      servicesResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.name}`);
      });
    }
  } catch (error) {
    log.error(`Failed to check services: ${error.message}`);
    log.info('Table "services" may not exist. Run migrations first.');
  }

  // Step 6: Test admin user
  log.title('👤 Step 6: Checking Admin User');
  
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, is_active 
      FROM users 
      WHERE email = 'admin@tejoss.com'
    `);
    
    if (result.rows.length === 0) {
      log.warn('Admin user not found!');
      log.info('Create admin using: node backend/generate-admin-hash.js');
      log.info('Then run UPDATE query in Supabase SQL Editor');
    } else {
      const admin = result.rows[0];
      log.success('Admin user found:');
      console.log(`  Email: ${admin.email}`);
      console.log(`  Name: ${admin.name}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Active: ${admin.is_active ? 'Yes' : 'No'}`);
    }
  } catch (error) {
    log.error(`Failed to check admin user: ${error.message}`);
    log.info('Table "users" may not exist. Run migrations first.');
  }

  // Close pool
  await pool.end();

  // Final result
  log.title('═══════════════════════════════════════');
  log.success('Database Connection Test Complete!');
  log.title('═══════════════════════════════════════');
  
  console.log('');
  log.info('Next steps:');
  console.log('  1. If tables missing: Run /supabase/migrations.sql in Supabase SQL Editor');
  console.log('  2. If services empty: Run /supabase/seed-services.sql in Supabase SQL Editor');
  console.log('  3. If admin missing: Run "node backend/generate-admin-hash.js" then update in Supabase');
  console.log('  4. Start backend: npm start');
  console.log('');
}

// Run test
testConnection().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
