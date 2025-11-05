-- Seed Services Data untuk Tejoss Platform
-- Run di Supabase SQL Editor setelah migrations.sql

INSERT INTO services (name, category, description, price, unit, features, is_active, image_url)
VALUES 
  ('Sewa Traktor + Operator', 'Peralatan', 'Sewa traktor lengkap dengan operator berpengalaman untuk pengolahan lahan', 500000, 'per hari', ARRAY['Operator Berpengalaman', 'BBM Termasuk', 'Maksimal 8 jam/hari'], true, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449'),
  
  ('Jasa Bajak Sawah', 'Jasa Tanam', 'Jasa pembajakan sawah dengan hasil yang rapi dan merata', 300000, 'per hektar', ARRAY['Pekerja Profesional', 'Garansi Hasil', 'Selesai 1 Hari'], true, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d'),
  
  ('Pupuk Organik Premium', 'Pupuk', 'Pupuk organik berkualitas tinggi dari bahan pilihan', 50000, 'per kg', ARRAY['100% Organik', 'Bebas Kimia', 'Ramah Lingkungan'], true, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b'),
  
  ('Benih Padi Unggul', 'Benih', 'Benih padi varietas unggul dengan produktivitas tinggi', 15000, 'per kg', ARRAY['Sertifikat Resmi', 'Daya Tumbuh 95%', 'Tahan Hama'], true, 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff'),
  
  ('Jasa Panen Padi', 'Jasa Panen', 'Jasa pemanenan padi dengan peralatan modern', 400000, 'per hektar', ARRAY['Alat Modern', 'Cepat & Efisien', 'Minimal Waste'], true, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'),
  
  ('Konsultasi Pertanian', 'Konsultasi', 'Konsultasi dengan ahli pertanian berpengalaman', 100000, 'per sesi', ARRAY['Ahli Berpengalaman', 'Solusi Tepat', 'Follow-up Gratis'], true, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158')

ON CONFLICT DO NOTHING;
