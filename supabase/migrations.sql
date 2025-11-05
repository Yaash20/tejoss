-- =====================================================
-- TEJOSS PLATFORM - SUPABASE DATABASE MIGRATION
-- =====================================================
-- This file contains all table definitions and initial setup
-- Run this in Supabase SQL Editor after creating your project
-- =====================================================

-- Drop existing tables if needed (uncomment if you want to reset)
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS order_timeline CASCADE;
-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS b2b_partnerships CASCADE;
-- DROP TABLE IF EXISTS articles CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'customer',
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================
-- 2. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  unit VARCHAR(50),
  image_url TEXT,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

-- =====================================================
-- 3. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  service_id BIGINT REFERENCES services(id),
  service_name VARCHAR(255),
  quantity DECIMAL(10, 2),
  unit VARCHAR(50),
  total_price DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  payment_method VARCHAR(100),
  location TEXT,
  schedule_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- =====================================================
-- 4. ORDER TIMELINE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_timeline (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_order_timeline_order_id ON order_timeline(order_id);

-- =====================================================
-- 5. PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  payment_method VARCHAR(100),
  amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255) UNIQUE,
  payment_proof_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

-- =====================================================
-- 6. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials(is_featured);

-- =====================================================
-- 7. ARTICLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  author VARCHAR(255),
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);

-- =====================================================
-- 8. B2B PARTNERSHIPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS b2b_partnerships (
  id BIGSERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company_type VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_b2b_partnerships_status ON b2b_partnerships(status);

-- =====================================================
-- 9. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =====================================================
-- 10. CREATE ADMIN USER (OPTIONAL)
-- =====================================================
-- Password: admin123 (hashed dengan bcrypt)
-- IMPORTANT: Ganti password ini setelah login pertama kali!
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin Tejoss',
  'admin@tejoss.com',
  '$2a$10$rG7mJZq3N3Y3Y3Y3Y3Y3YuO3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y3Y',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Note: Password hash di atas adalah contoh, ganti dengan hash yang benar
-- Untuk generate hash, jalankan di Node.js:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('admin123', 10).then(hash => console.log(hash));

-- =====================================================
-- 11. RPC FUNCTION FOR RAW SQL (Advanced queries)
-- =====================================================
-- This function allows executing raw SQL queries from the API
-- WARNING: Only use if absolutely necessary, prefer Supabase query builder
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT, sql_params TEXT[] DEFAULT '{}')
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- This is a simplified version
  -- In production, you should implement proper query execution
  -- For now, we'll rely on Supabase's built-in query builder
  RETURN '[]'::JSON;
END;
$$;

-- =====================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read access for services (active only)
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Public read access for approved testimonials
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = true);

-- Public read access for published articles
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  USING (is_published = true);

-- Note: Other policies will be handled via Service Role Key in API

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Generate admin password hash and update the INSERT statement
-- 3. Seed services data if needed
-- 4. Test the API endpoints
-- =====================================================
