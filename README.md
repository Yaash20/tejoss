# 🌾 TEJOSS PLATFORM - Serverless Edition

> **Platform Jasa Pertanian One-Stop Service**  
> Refactored to **100% Serverless** with Supabase + Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/tejoss-platform)

---

## 📖 TENTANG PROJECT

**Tejoss Platform** adalah platform jasa pertanian yang menyediakan:
- 🚜 Penyewaan alat pertanian
- 🌱 Penjualan pupuk & benih
- 👨‍🌾 Jasa tenaga ahli pertanian
- 📚 Edukasi pertanian modern
- 🏢 Kemitraan B2B

### ✨ Fitur Lengkap:
- ✅ **Sistem Login/Register** dengan JWT authentication
- ✅ **Katalog Layanan** dengan kategori & pencarian
- ✅ **Sistem Pemesanan** dengan tracking timeline
- ✅ **Payment Gateway** terintegrasi Midtrans (VA, Credit Card, E-Wallet)
- ✅ **Panel Admin** dengan dashboard statistik
- ✅ **Testimoni** dengan approval system
- ✅ **Artikel Edukasi** dengan view counter
- ✅ **B2B Partnership** request system
- ✅ **Notifikasi** real-time
- ✅ **Role-based Access** (Customer & Admin)

---

## 🏗️ TECH STACK

### **Frontend:**
- Vanilla HTML/CSS/JavaScript
- Responsive design
- Midtrans Snap.js

### **Backend (Serverless):**
- **Runtime:** Vercel Serverless Functions (Node.js 18+)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT (jsonwebtoken)
- **Payment:** Midtrans API
- **Hosting:** Vercel

### **Architecture:**
```
Frontend (HTML/JS)
     ↓
Vercel Serverless API (/api/**/*.js)
     ↓
Supabase PostgreSQL Database
     ↓
Midtrans Payment Gateway
```

---

## 📂 STRUKTUR PROJECT

```
tejoss-platform/
├── api/                          # Vercel Serverless Functions
│   ├── auth/                     # Authentication endpoints
│   ├── services/                 # Services management
│   ├── orders/                   # Order management
│   ├── payments/                 # Payment & Midtrans webhook
│   ├── testimonials/             # Testimonials
│   ├── articles/                 # Articles/Blog
│   ├── b2b/                      # B2B partnerships
│   └── notifications/            # Notifications
│
├── lib/                          # Helper libraries
│   ├── supabase.js              # Supabase client
│   ├── auth.js                  # Auth helpers
│   ├── validation.js            # Validation
│   ├── midtrans.js              # Midtrans config
│   └── response.js              # Response formatters
│
├── supabase/
│   └── migrations.sql           # Database schema
│
├── js/                          # Frontend JavaScript
│   ├── config.js               # API configuration
│   ├── api.js                  # API client
│   ├── app.js                  # Main app logic
│   └── pages.js                # Page controllers
│
├── css/                         # Stylesheets
├── index.html                   # Main HTML
├── vercel.json                  # Vercel config
├── package.json                 # Dependencies
│
└── backend/                     # 🗂️ OLD Express.js backend (archived)
```

---

## 🚀 QUICK START

### **Option 1: Deploy ke Production (Recommended)**

**Total waktu: ~30 menit**

1. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/tejoss-platform.git
   cd tejoss-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Supabase:**
   - Buat account di https://supabase.com
   - Buat project baru (Singapore region)
   - Run `/supabase/migrations.sql` di SQL Editor
   - Copy credentials (URL, keys)

4. **Deploy ke Vercel:**
   - Push ke GitHub
   - Import di https://vercel.com
   - Set environment variables
   - Deploy!

5. **Update frontend config:**
   ```javascript
   // js/config.js
   API_CONFIG.BASE_URL = 'https://your-vercel-url.vercel.app'
   ```

**📖 Panduan lengkap:** Baca `QUICK_START.md` atau `PANDUAN_DEPLOY_SUPABASE_VERCEL.md`

---

### **Option 2: Development Local**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Setup environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local dengan credentials kamu
   ```

3. **Run development server:**
   ```bash
   vercel dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

---

## 📚 DOKUMENTASI

| File | Deskripsi |
|------|-----------|
| `QUICK_START.md` | ⚡ Deploy cepat 30 menit |
| `PANDUAN_DEPLOY_SUPABASE_VERCEL.md` | 📖 Panduan lengkap step-by-step |
| `API_ENDPOINTS.md` | 📡 Dokumentasi API lengkap |
| `backend/README.md` | 🗂️ Dokumentasi backend lama (archived) |

---

## 🔑 ENVIRONMENT VARIABLES

Untuk production, set di Vercel dashboard:

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# JWT
JWT_SECRET=your-secret-key

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_IS_PRODUCTION=false

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

---

## 🧪 TESTING

### Test API Endpoints:

```bash
# Health check
curl https://your-vercel-url.vercel.app/api/health

# Get services
curl https://your-vercel-url.vercel.app/api/services

# Register user
curl -X POST https://your-vercel-url.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test1234"}'
```

### Test Payment Flow:

1. Login/Register
2. Pilih service & buat order
3. Klik "Bayar" → redirect ke Midtrans
4. Gunakan test credentials:
   - **Card:** 4811 1111 1111 1114
   - **Exp:** 01/25
   - **CVV:** 123
5. Complete payment
6. Status order auto-update

---

## 💰 BIAYA

| Item | Biaya | Gratis Tier |
|------|-------|-------------|
| **Vercel Hosting** | $0/bulan | ✅ 100GB bandwidth/bulan |
| **Supabase Database** | $0/bulan | ✅ 500MB database |
| **Vercel Serverless** | $0/bulan | ✅ 100GB-hours |
| **SSL Certificate** | $0 | ✅ Auto-generated |
| **Domain** | ~$10/tahun | ❌ Perlu beli |

**Total untuk traffic normal: $0/bulan** 🎉

Upgrade hanya jika:
- Traffic > 100GB/bulan (Vercel Pro $20/bulan)
- Database > 500MB (Supabase Pro $25/bulan)

---

## 🔐 SECURITY

- ✅ **JWT Authentication** dengan bcrypt password hashing
- ✅ **Row Level Security** di Supabase
- ✅ **Environment variables** untuk sensitive data
- ✅ **CORS protection**
- ✅ **Input validation** di semua endpoints
- ✅ **Role-based authorization**
- ✅ **Midtrans signature verification**

---

## 📊 MONITORING

### Vercel:
- **Dashboard:** https://vercel.com/dashboard
- **Logs:** Deployments > Latest > Logs
- **Analytics:** Built-in analytics

### Supabase:
- **Dashboard:** https://app.supabase.com
- **Database:** Monitor queries, connections
- **Logs:** Real-time PostgreSQL logs

---

## 🛠️ TROUBLESHOOTING

### Error 500 di API?
→ Check Vercel logs untuk detailed error

### Database connection error?
→ Verify Supabase credentials di ENV variables

### Payment tidak update status?
→ Check Midtrans notification URL sudah diset

### Token expired?
→ Re-login atau check JWT_SECRET sama di semua environment

**Troubleshooting lengkap:** Lihat `PANDUAN_DEPLOY_SUPABASE_VERCEL.md`

---

## 🚢 DEPLOYMENT STATUS

### v2.0.0 (Serverless) - Current
- ✅ **Backend:** Vercel Serverless Functions
- ✅ **Database:** Supabase PostgreSQL
- ✅ **Status:** Production Ready
- ✅ **Biaya:** $0/bulan (Free tier)

### v1.0.0 (Express.js) - Archived
- 📦 **Backend:** Express.js + PostgreSQL localhost
- 📦 **Lokasi:** `/backend/` folder
- 📦 **Status:** Archived (masih bisa dipakai untuk development)

---

## 📞 SUPPORT

- **Issues:** https://github.com/yourusername/tejoss-platform/issues
- **Email:** support@tejoss.com
- **Docs:** Lihat folder `guidelines/`

---

## 📝 LICENSE

MIT License - Feel free to use for your projects!

---

## 🙏 CREDITS

**Built with:**
- [Vercel](https://vercel.com) - Serverless hosting
- [Supabase](https://supabase.com) - Database & Auth
- [Midtrans](https://midtrans.com) - Payment gateway

**Developed by:** Tejoss Platform Team  
**Last Updated:** November 2024

---

## 🎯 ROADMAP

- [ ] Add WhatsApp notifications
- [ ] Implement real-time chat
- [ ] Add mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] AI-powered crop recommendations

---

**⭐ Star this repo if you find it useful!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/tejoss-platform?style=social)](https://github.com/yourusername/tejoss-platform)
