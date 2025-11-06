# ⚡ QUICK START - DEPLOY TEJOSS KE SUPABASE + VERCEL

Panduan singkat untuk deploy cepat. Untuk detail lengkap, baca `PANDUAN_DEPLOY_SUPABASE_VERCEL.md`.

---

## 📦 YANG SUDAH DIBUAT

✅ **27 files baru** sudah ready:
- 5 lib helpers (`/lib/*.js`)
- 20 API endpoints (`/api/**/*.js`)
- 1 database migration (`/supabase/migrations.sql`)
- 1 vercel config (`vercel.json`)

---

## 🚀 LANGKAH DEPLOY (30 MENIT)

### 1️⃣ INSTALL DEPENDENCIES (5 menit)

```bash
# Di root folder project
npm install @supabase/supabase-js bcryptjs jsonwebtoken midtrans-client
```

---

### 2️⃣ SETUP SUPABASE (10 menit)

1. **Buat account:** https://supabase.com (login dengan GitHub)
2. **Buat project:** Name = `tejoss`, Region = Singapore, Plan = Free
3. **Run migration:**
   - Buka SQL Editor
   - Copy-paste isi `/supabase/migrations.sql`
   - Klik Run
4. **Generate admin password:**
   ```bash
   node -e "require('bcryptjs').hash('admin123', 10).then(h => console.log(h))"
   ```
5. **Update admin password di SQL Editor:**
   ```sql
   UPDATE users SET password = 'HASH_DARI_STEP_4' WHERE email = 'admin@tejoss.com';
   ```
6. **Copy credentials:**
   - Settings > API
   - Copy: Project URL, anon key, service_role key

---

### 3️⃣ PUSH KE GITHUB (2 menit)

```bash
git init
git add .
git commit -m "Refactor to Serverless"
git remote add origin https://github.com/USERNAME/tejoss.git
git push -u origin main
```

---

### 4️⃣ DEPLOY KE VERCEL (10 menit)

1. **Buat account:** https://vercel.com (login dengan GitHub)
2. **Import project:** Add New > Project > Pilih repo `tejoss`
3. **Set ENV variables** (7 variables):
   ```
   SUPABASE_URL = https://xxx.supabase.co
   SUPABASE_ANON_KEY = eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY = eyJxxx...
   JWT_SECRET = your-secret-key-here
   MIDTRANS_SERVER_KEY = SB-Mid-server-xxx
   MIDTRANS_CLIENT_KEY = SB-Mid-client-xxx
   MIDTRANS_IS_PRODUCTION = false
   ```
4. **Deploy!** Klik Deploy
5. **Copy URL:** Contoh: `https://tejoss-xxx.vercel.app`

---

### 5️⃣ UPDATE FRONTEND (3 menit)

Edit `/js/config.js`:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://tejoss-xxx.vercel.app',  // ← GANTI INI
    API_URL: 'https://tejoss-xxx.vercel.app/api',  // ← GANTI INI
    // ... sisanya tetap
};
```

Push changes:
```bash
git add js/config.js
git commit -m "Update API URL"
git push
```

Vercel auto-deploy!

---

### 6️⃣ UPDATE MIDTRANS (2 menit)

1. Login Midtrans Dashboard
2. Settings > Configuration
3. Set **Payment Notification URL:**
   ```
   https://tejoss-xxx.vercel.app/api/payments/midtrans-notification
   ```

---

## ✅ TESTING

### Test API:
```bash
# Health check
curl https://tejoss-xxx.vercel.app/api/health

# Get services
curl https://tejoss-xxx.vercel.app/api/services

# Register
curl -X POST https://tejoss-xxx.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test1234"}'
```

### Test Frontend:
1. Buka website di browser
2. Register user baru
3. Login
4. Buat order
5. Test payment

---

## 🎉 DONE!

Website sudah live! Total waktu: **~30 menit**

**Biaya:**
- ✅ Hosting: **GRATIS** (Vercel + Supabase)
- ✅ Database: **GRATIS** (Supabase Free Tier)
- ✅ SSL: **GRATIS** (Auto by Vercel)
- 💰 Domain: ~Rp 150k/tahun (opsional)

---

## 🐛 TROUBLESHOOTING CEPAT

**Error 500?**
→ Check Vercel logs (Dashboard > Deployments > Latest > Logs)

**Database error?**
→ Check ENV variables di Vercel, pastikan Supabase credentials benar

**CORS error?**
→ Redeploy Vercel (vercel.json sudah set CORS)

**Payment not updating?**
→ Check Midtrans notification URL sudah diset

---

## 📚 DOKUMENTASI LENGKAP

- **Full Guide:** `PANDUAN_DEPLOY_SUPABASE_VERCEL.md`
- **API Docs:** `API_ENDPOINTS.md`
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs

---

**🚀 Happy Deploying!**
