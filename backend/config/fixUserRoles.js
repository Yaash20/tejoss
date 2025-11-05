/**
 * Script untuk memperbaiki role user di database
 * Semua user kecuali admin@tejoss.com akan diset menjadi 'customer'
 */

const { query } = require('./database');

async function fixUserRoles() {
    console.log('🔧 Memulai perbaikan role user...\n');
    
    try {
        // 1. Cek semua user yang ada
        console.log('📋 Mengecek user yang ada di database...');
        const usersResult = await query('SELECT id, name, email, role FROM users ORDER BY id');
        
        console.log(`\n✅ Ditemukan ${usersResult.rows.length} user:\n`);
        usersResult.rows.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
        });
        
        // 2. Update semua user kecuali admin@tejoss.com menjadi 'customer'
        console.log('\n🔄 Mengupdate role user (kecuali admin@tejoss.com)...');
        const updateResult = await query(`
            UPDATE users 
            SET role = 'customer', 
                updated_at = CURRENT_TIMESTAMP 
            WHERE email != 'admin@tejoss.com' 
            AND role != 'customer'
            RETURNING id, name, email, role
        `);
        
        if (updateResult.rows.length > 0) {
            console.log(`\n✅ Berhasil update ${updateResult.rows.length} user:`);
            updateResult.rows.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.name} (${user.email}) → Role: customer`);
            });
        } else {
            console.log('\n✓ Semua user sudah memiliki role yang benar');
        }
        
        // 3. Pastikan admin@tejoss.com adalah 'admin'
        console.log('\n🔐 Memastikan admin@tejoss.com adalah admin...');
        const adminResult = await query(`
            UPDATE users 
            SET role = 'admin',
                updated_at = CURRENT_TIMESTAMP 
            WHERE email = 'admin@tejoss.com'
            AND role != 'admin'
            RETURNING id, name, email, role
        `);
        
        if (adminResult.rows.length > 0) {
            console.log('✅ Admin role diperbaiki');
        } else {
            console.log('✓ Admin role sudah benar');
        }
        
        // 4. Tampilkan hasil akhir
        console.log('\n📊 STATUS AKHIR:');
        console.log('================\n');
        
        const finalResult = await query(`
            SELECT 
                role,
                COUNT(*) as jumlah,
                STRING_AGG(email, ', ') as emails
            FROM users 
            GROUP BY role
            ORDER BY role
        `);
        
        finalResult.rows.forEach(row => {
            console.log(`Role: ${row.role.toUpperCase()}`);
            console.log(`Jumlah: ${row.jumlah} user`);
            console.log(`Email: ${row.emails}`);
            console.log('');
        });
        
        console.log('✅ Perbaikan role selesai!\n');
        console.log('📝 CATATAN:');
        console.log('   - Admin: admin@tejoss.com');
        console.log('   - User lainnya: customer (bisa login & order)\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Jalankan script
fixUserRoles();
