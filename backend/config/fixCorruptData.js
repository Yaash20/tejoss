// Script untuk memperbaiki data JSON yang corrupt di database
const { query } = require('./database');

async function fixCorruptServices() {
  try {
    console.log('🔧 Memperbaiki data services yang corrupt...');
    
    // Get all services
    const result = await query('SELECT * FROM services');
    const services = result.rows;
    
    let fixed = 0;
    let errors = 0;
    
    for (const service of services) {
      try {
        // Check if features is valid JSON
        let validFeatures = [];
        
        if (service.features) {
          if (typeof service.features === 'string') {
            try {
              const parsed = JSON.parse(service.features);
              validFeatures = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              // Invalid JSON, set to empty array
              console.log(`⚠️  Service ID ${service.id} (${service.name}): features tidak valid, direset ke []`);
              validFeatures = [];
            }
          } else if (Array.isArray(service.features)) {
            validFeatures = service.features;
          } else {
            console.log(`⚠️  Service ID ${service.id} (${service.name}): features bukan string/array, direset ke []`);
            validFeatures = [];
          }
        }
        
        // Update service with valid features
        await query(
          'UPDATE services SET features = $1 WHERE id = $2',
          [JSON.stringify(validFeatures), service.id]
        );
        
        fixed++;
      } catch (error) {
        console.error(`❌ Error fixing service ID ${service.id}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n✅ Selesai! Fixed: ${fixed}, Errors: ${errors}`);
    console.log('✅ Semua data services sudah diperbaiki!\n');
    
    return { fixed, errors };
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  fixCorruptServices()
    .then(() => {
      console.log('✅ Script selesai!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Script gagal:', err);
      process.exit(1);
    });
}

module.exports = { fixCorruptServices };
