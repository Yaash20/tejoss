const { pool } = require('./database');
require('dotenv').config();

const seedServices = async () => {
  try {
    console.log('🌱 Seeding services data...');

    // Check if services already exist
    const existing = await pool.query('SELECT COUNT(*) FROM services');
    const count = parseInt(existing.rows[0].count);

    if (count > 0) {
      console.log(`⚠️  Found ${count} existing services. Updating...`);
      
      // Update existing services
      const services = [
        {
          name: 'Jasa Panen',
          category: 'Jasa Panen',
          description: 'Layanan panen dengan peralatan modern dan tenaga kerja berpengalaman',
          price: 150000,
          unit: 'Ha',
          features: ['Peralatan modern', 'Tenaga kerja terlatih', 'Panen cepat & bersih', 'Garansi kualitas']
        },
        {
          name: 'Jasa Tanam',
          category: 'Jasa Tanam',
          description: 'Penanaman bibit dengan teknik terbaik untuk hasil panen optimal',
          price: 200000,
          unit: 'Ha',
          features: ['Teknik penanaman modern', 'Bibit berkualitas', 'Jaminan optimal', 'Monitoring pertumbuhan']
        },
        {
          name: 'Jasa Angkut',
          category: 'Jasa Angkut',
          description: 'Transportasi hasil panen ke tempat tujuan dengan aman',
          price: 50000,
          unit: 'ton',
          features: ['Kendaraan khusus', 'Pengemasan aman', 'Tracking real-time', 'Asuransi barang']
        },
        {
          name: 'Jasa Giling',
          category: 'Jasa Giling',
          description: 'Penggilingan padi/jagung dengan mesin modern',
          price: 100000,
          unit: 'ton',
          features: ['Mesin modern', 'Hasil berkualitas', 'Proses cepat', 'Kemasan rapi']
        },
        {
          name: 'Sewa Traktor',
          category: 'Peralatan',
          description: 'Penyewaan traktor dan alat pertanian modern',
          price: 300000,
          unit: 'hari',
          features: ['Traktor modern', 'Operator berpengalaman', 'Bahan bakar include', 'Maintenance terjamin']
        },
        {
          name: 'Tenaga Kerja',
          category: 'Tenaga Kerja',
          description: 'Penyediaan tenaga kerja pertanian terlatih',
          price: 100000,
          unit: 'orang/hari',
          features: ['Pekerja terlatih', 'Pengalaman luas', 'Asuransi kerja', 'Supervisi ketat']
        }
      ];

      for (const service of services) {
        await pool.query(
          `INSERT INTO services (name, category, description, price, unit, features, is_active) 
           VALUES ($1, $2, $3, $4, $5, $6, true)
           ON CONFLICT DO NOTHING`,
          [service.name, service.category, service.description, service.price, service.unit, service.features]
        );
      }
      
      console.log('✅ Services updated successfully!');
    } else {
      // Insert new services
      const services = [
        {
          name: 'Jasa Panen',
          category: 'Jasa Panen',
          description: 'Layanan panen dengan peralatan modern dan tenaga kerja berpengalaman',
          price: 150000,
          unit: 'Ha',
          features: ['Peralatan modern', 'Tenaga kerja terlatih', 'Panen cepat & bersih', 'Garansi kualitas']
        },
        {
          name: 'Jasa Tanam',
          category: 'Jasa Tanam',
          description: 'Penanaman bibit dengan teknik terbaik untuk hasil panen optimal',
          price: 200000,
          unit: 'Ha',
          features: ['Teknik penanaman modern', 'Bibit berkualitas', 'Jaminan optimal', 'Monitoring pertumbuhan']
        },
        {
          name: 'Jasa Angkut',
          category: 'Jasa Angkut',
          description: 'Transportasi hasil panen ke tempat tujuan dengan aman',
          price: 50000,
          unit: 'ton',
          features: ['Kendaraan khusus', 'Pengemasan aman', 'Tracking real-time', 'Asuransi barang']
        },
        {
          name: 'Jasa Giling',
          category: 'Jasa Giling',
          description: 'Penggilingan padi/jagung dengan mesin modern',
          price: 100000,
          unit: 'ton',
          features: ['Mesin modern', 'Hasil berkualitas', 'Proses cepat', 'Kemasan rapi']
        },
        {
          name: 'Sewa Traktor',
          category: 'Peralatan',
          description: 'Penyewaan traktor dan alat pertanian modern',
          price: 300000,
          unit: 'hari',
          features: ['Traktor modern', 'Operator berpengalaman', 'Bahan bakar include', 'Maintenance terjamin']
        },
        {
          name: 'Tenaga Kerja',
          category: 'Tenaga Kerja',
          description: 'Penyediaan tenaga kerja pertanian terlatih',
          price: 100000,
          unit: 'orang/hari',
          features: ['Pekerja terlatih', 'Pengalaman luas', 'Asuransi kerja', 'Supervisi ketat']
        }
      ];

      for (const service of services) {
        await pool.query(
          `INSERT INTO services (name, category, description, price, unit, features, is_active) 
           VALUES ($1, $2, $3, $4, $5, $6, true)`,
          [service.name, service.category, service.description, service.price, service.unit, service.features]
        );
      }

      console.log('✅ 6 services inserted successfully!');
    }

    // Show all services
    const result = await pool.query('SELECT id, name, price, unit FROM services ORDER BY id');
    console.log('\n📋 Current services in database:');
    result.rows.forEach(service => {
      console.log(`   ${service.id}. ${service.name} - Rp ${parseFloat(service.price).toLocaleString('id-ID')}/${service.unit}`);
    });
    
    console.log('\n🎯 Services seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Services seeding failed:', error);
    process.exit(1);
  }
};

seedServices();
