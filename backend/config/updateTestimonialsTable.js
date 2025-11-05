// Script untuk update tabel testimonials
// Menambah kolom 'message' dan 'status', serta support field lama untuk backward compatibility

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tejoss_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function updateTestimonialsTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Memulai update tabel testimonials...\n');
    
    // 1. Tambah kolom 'message' jika belum ada (duplikat dari 'comment')
    console.log('1️⃣  Menambahkan kolom message...');
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='testimonials' AND column_name='message') THEN
          ALTER TABLE testimonials ADD COLUMN message TEXT;
          UPDATE testimonials SET message = comment WHERE message IS NULL;
        END IF;
      END $$;
    `);
    console.log('   ✅ Kolom message berhasil ditambahkan\n');
    
    // 2. Tambah kolom 'status' jika belum ada
    console.log('2️⃣  Menambahkan kolom status...');
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='testimonials' AND column_name='status') THEN
          ALTER TABLE testimonials ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
          UPDATE testimonials SET status = CASE 
            WHEN is_approved = true THEN 'approved'
            WHEN is_approved = false THEN 'pending'
            ELSE 'pending'
          END;
        END IF;
      END $$;
    `);
    console.log('   ✅ Kolom status berhasil ditambahkan\n');
    
    // 3. Tambah kolom 'service_name' jika belum ada (untuk testimoni tanpa order)
    console.log('3️⃣  Menambahkan kolom service_name...');
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='testimonials' AND column_name='service_name') THEN
          ALTER TABLE testimonials ADD COLUMN service_name VARCHAR(255);
        END IF;
      END $$;
    `);
    console.log('   ✅ Kolom service_name berhasil ditambahkan\n');
    
    // 4. Update constraint untuk order_id (buat optional)
    console.log('4️⃣  Mengupdate constraint order_id...');
    await client.query(`
      ALTER TABLE testimonials ALTER COLUMN order_id DROP NOT NULL;
    `).catch(() => {
      console.log('   ⚠️  order_id sudah nullable');
    });
    console.log('   ✅ Constraint order_id berhasil diupdate\n');
    
    // 5. Sync data dari comment ke message
    console.log('5️⃣  Sinkronisasi data comment -> message...');
    const syncResult = await client.query(`
      UPDATE testimonials 
      SET message = comment 
      WHERE message IS NULL AND comment IS NOT NULL;
    `);
    console.log(`   ✅ ${syncResult.rowCount} record berhasil disinkronisasi\n`);
    
    // 6. Tampilkan statistik
    console.log('📊 Statistik Testimonials:');
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN is_featured = true THEN 1 END) as featured
      FROM testimonials;
    `);
    
    const { total, approved, pending, rejected, featured } = stats.rows[0];
    console.log(`   Total: ${total}`);
    console.log(`   Approved: ${approved}`);
    console.log(`   Pending: ${pending}`);
    console.log(`   Rejected: ${rejected}`);
    console.log(`   Featured: ${featured}\n`);
    
    console.log('✅ Update tabel testimonials berhasil!\n');
    console.log('📝 Catatan:');
    console.log('   - Field "comment" dan "is_approved" masih ada untuk backward compatibility');
    console.log('   - Field "message" dan "status" adalah field baru yang direkomendasikan');
    console.log('   - order_id sekarang optional (bisa NULL untuk testimonial umum)');
    
  } catch (error) {
    console.error('\n❌ Error saat update tabel:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run script
updateTestimonialsTable()
  .then(() => {
    console.log('\n✨ Script selesai');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script gagal:', error);
    process.exit(1);
  });
