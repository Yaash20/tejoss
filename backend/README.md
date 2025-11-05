# Tejoss Backend API

Backend API untuk platform jasa pertanian Tejoss - One-stop service dengan fokus pada transparansi harga dan standar kualitas layanan.

## 🚀 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Express Validator

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- Node.js (v18 atau lebih tinggi)
- PostgreSQL (v12 atau lebih tinggi)
- npm atau yarn

## 🔧 Installation

### 1. Clone dan Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

Buat database PostgreSQL baru:

```sql
CREATE DATABASE tejoss_db;
```

### 3. Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi Anda:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=tejoss_db

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 4. Initialize Database

Jalankan script untuk membuat tabel dan insert data sample:

```bash
npm run init-db
```

Script ini akan:
- ✅ Membuat semua tabel yang diperlukan
- ✅ Insert data sample services
- ✅ Insert data sample articles

## 🎯 Running the Server

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000` dengan auto-reload.

### Production Mode

```bash
npm start
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register user baru
- `POST /login` - Login user
- `GET /me` - Get user profile (Protected)
- `PUT /profile` - Update profile (Protected)
- `PUT /change-password` - Change password (Protected)

### Services (`/api/services`)
- `GET /` - Get all services
- `GET /:id` - Get service by ID
- `GET /category/:category` - Get services by category
- `POST /` - Create service (Admin)
- `PUT /:id` - Update service (Admin)
- `DELETE /:id` - Delete service (Admin)

### Orders (`/api/orders`)
- `POST /` - Create new order (Protected)
- `GET /` - Get user orders (Protected)
- `GET /stats/dashboard` - Get order statistics (Protected)
- `GET /:id` - Get order detail (Protected)
- `PUT /:id/cancel` - Cancel order (Protected)
- `PUT /:id/status` - Update order status (Admin)

### Payments (`/api/payments`)
- `POST /` - Process payment (Protected)
- `POST /upload-proof` - Upload payment proof (Protected)
- `GET /order/:orderId` - Get payment by order (Protected)
- `PUT /:id/verify` - Verify payment (Admin)

### Testimonials (`/api/testimonials`)
- `GET /` - Get all approved testimonials
- `GET /stats/summary` - Get testimonial statistics
- `GET /:id` - Get testimonial by ID
- `POST /` - Create testimonial (Protected)
- `GET /user/my-testimonials` - Get user testimonials (Protected)
- `PUT /:id` - Update testimonial (Protected)
- `DELETE /:id` - Delete testimonial (Protected)
- `PUT /:id/approve` - Approve testimonial (Admin)

### Articles (`/api/articles`)
- `GET /` - Get all articles
- `GET /popular/top` - Get popular articles
- `GET /category/:category` - Get articles by category
- `GET /:slug` - Get article by slug
- `GET /:id/related` - Get related articles
- `POST /` - Create article (Admin)
- `PUT /:id` - Update article (Admin)
- `DELETE /:id` - Delete article (Admin)

### B2B Partnerships (`/api/b2b`)
- `POST /` - Submit partnership request
- `GET /` - Get all partnerships (Admin)
- `GET /stats/summary` - Get partnership stats (Admin)
- `GET /:id` - Get partnership by ID (Admin)
- `PUT /:id/status` - Update partnership status (Admin)
- `DELETE /:id` - Delete partnership (Admin)

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications (Protected)
- `PUT /read-all` - Mark all as read (Protected)
- `PUT /:id/read` - Mark as read (Protected)
- `DELETE /clear-read` - Clear read notifications (Protected)
- `DELETE /:id` - Delete notification (Protected)

## 🔐 Authentication

API menggunakan JWT Bearer token untuk autentikasi. Setelah login, include token di header:

```
Authorization: Bearer <your_token_here>
```

## 📊 Database Schema

### Users
- id, name, email, password, phone, role, avatar_url, is_verified, created_at, updated_at

### Services
- id, name, category, description, price, unit, image_url, features, is_active, created_at, updated_at

### Orders
- id, order_number, user_id, service_id, service_name, quantity, unit, total_price, status, payment_status, payment_method, location, schedule_date, notes, created_at, updated_at

### Order Timeline
- id, order_id, status, description, created_at

### Payments
- id, order_id, payment_method, amount, status, transaction_id, payment_proof_url, paid_at, created_at

### Testimonials
- id, user_id, order_id, rating, comment, is_featured, is_approved, created_at

### Articles
- id, title, slug, category, excerpt, content, image_url, author, views, is_published, published_at, created_at, updated_at

### B2B Partnerships
- id, company_name, contact_person, email, phone, company_type, description, status, created_at, updated_at

### Notifications
- id, user_id, title, message, type, is_read, created_at

## 🛡️ Security Features

- ✅ Helmet.js untuk security headers
- ✅ CORS configuration
- ✅ Rate limiting untuk mencegah abuse
- ✅ Password hashing dengan bcrypt
- ✅ JWT authentication
- ✅ Input validation
- ✅ SQL injection prevention dengan parameterized queries

## 📦 Deployment

### Deploy ke VPS/Cloud Server

1. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   ```

2. **Setup Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE tejoss_db;
   CREATE USER tejoss_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE tejoss_db TO tejoss_user;
   \q
   ```

3. **Clone & Install**
   ```bash
   git clone <your-repo-url>
   cd backend
   npm install --production
   ```

4. **Setup Environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit dengan konfigurasi production
   ```

5. **Initialize Database**
   ```bash
   npm run init-db
   ```

6. **Setup PM2 untuk Process Manager**
   ```bash
   npm install -g pm2
   pm2 start server.js --name tejoss-api
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx sebagai Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Deploy ke Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login dan Create App**
   ```bash
   heroku login
   heroku create tejoss-api
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   heroku config:set CLIENT_URL=https://yourfrontend.com
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Initialize Database**
   ```bash
   heroku run npm run init-db
   ```

## 🧪 Testing

Test API menggunakan tools seperti:
- Postman
- Thunder Client (VS Code Extension)
- cURL

Example cURL request:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database tables and sample data

## 🤝 Support

Untuk bantuan atau pertanyaan, silakan hubungi tim Tejoss.

## 📄 License

MIT License - © 2025 Tejoss
