// Additional Pages - Login, Payment, MyOrders
  
  // Login Page
  function renderLoginPage() {
      return `
          <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12">
              <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <!-- Left Side - Branding -->
                      <div class="text-center lg:text-left">
                          <div class="mb-8">
                              <img src="2.png" alt="Tejoss" class="h-16 w-auto mx-auto lg:mx-0 mb-6">
                              <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                  Bergabunglah dengan<br>
                                  <span class="text-green-600">Revolusi Pertanian</span>
                              </h1>
                              <p class="text-xl text-gray-600 mb-8">
                                  Akses layanan jasa pertanian modern, transparan, dan terpercaya. 
                                  Tingkatkan produktivitas lahan Anda bersama ribuan petani lainnya.
                              </p>
                          </div>
  
                          <!-- Benefits -->
                          <div class="space-y-4">
                              <div class="flex items-start gap-3">
                                  <i data-lucide="check-circle" class="h-5 w-5 text-green-600 mt-1"></i>
                                  <div class="text-left">
                                      <h3 class="font-semibold text-gray-900">Akses Layanan Lengkap</h3>
                                      <p class="text-sm text-gray-600">Pesan semua jasa pertanian dalam satu platform</p>
                                  </div>
                              </div>
                              <div class="flex items-start gap-3">
                                  <i data-lucide="check-circle" class="h-5 w-5 text-green-600 mt-1"></i>
                                  <div class="text-left">
                                      <h3 class="font-semibold text-gray-900">Tracking Pesanan Real-time</h3>
                                      <p class="text-sm text-gray-600">Pantau progress pekerjaan dari smartphone Anda</p>
                                  </div>
                              </div>
                              <div class="flex items-start gap-3">
                                  <i data-lucide="check-circle" class="h-5 w-5 text-green-600 mt-1"></i>
                                  <div class="text-left">
                                      <h3 class="font-semibold text-gray-900">Konsultasi Gratis</h3>
                                      <p class="text-sm text-gray-600">Akses konsultasi dengan ahli pertanian kapan saja</p>
                                  </div>
                              </div>
                              <div class="flex items-start gap-3">
                                  <i data-lucide="check-circle" class="h-5 w-5 text-green-600 mt-1"></i>
                                  <div class="text-left">
                                      <h3 class="font-semibold text-gray-900">Diskon Member Eksklusif</h3>
                                      <p class="text-sm text-gray-600">Dapatkan harga khusus dan penawaran terbaik</p>
                                  </div>
                              </div>
                          </div>
  
                          <div class="mt-8 p-4 bg-green-600 rounded-lg text-white text-center">
                              <i data-lucide="shield" class="h-8 w-8 mx-auto mb-2"></i>
                              <p class="font-semibold">Data Anda Aman</p>
                              <p class="text-sm text-green-100">
                                  Kami menggunakan enkripsi SSL dan mengikuti standar keamanan terbaik
                              </p>
                          </div>
                      </div>
  
                      <!-- Right Side - Auth Forms -->
                      <div class="max-w-md mx-auto w-full">
                          <div class="card shadow-xl">
                              <div class="p-8">
                                  <div class="text-center mb-6">
                                      <h2 class="text-2xl font-bold mb-2" id="auth-title">Masuk ke Akun Anda</h2>
                                      <p class="text-gray-600" id="auth-subtitle">Selamat datang kembali! Masuk untuk melanjutkan.</p>
                                  </div>
  
                                  <!-- Tabs -->
                                  <div class="flex border-b mb-6">
                                      <button onclick="switchAuthTab('login')" class="auth-tab flex-1 py-3 text-center font-medium border-b-2 border-green-600 text-green-600" data-tab="login">
                                          Masuk
                                      </button>
                                      <button onclick="switchAuthTab('register')" class="auth-tab flex-1 py-3 text-center font-medium border-b-2 border-transparent text-gray-500" data-tab="register">
                                          Daftar
                                      </button>
                                  </div>
  
                                  <!-- Login Form -->
                                  <div id="login-form">
                                      <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                              <div class="relative">
                                                  <i data-lucide="mail" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"></i>
                                                  <input type="email" name="email" placeholder="nama@email.com" required
                                                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                              </div>
                                          </div>
  
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                              <div class="relative">
                                                  <i data-lucide="lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"></i>
                                                  <input type="password" name="password" placeholder="Masukkan password" required
                                                      class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                              </div>
                                          </div>
  
                                          <div class="flex items-center justify-between">
                                              <label class="flex items-center">
                                                  <input type="checkbox" class="mr-2">
                                                  <span class="text-sm">Ingat saya</span>
                                              </label>
                                              <button type="button" class="text-sm text-green-600 hover:underline">
                                                  Lupa password?
                                              </button>
                                          </div>
  
                                          <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                                              Masuk
                                          </button>
                                      </form>
                                  </div>
  
                                  <!-- Register Form -->
                                  <div id="register-form" class="hidden">
                                      <form onsubmit="handleRegisterSubmit(event)" class="space-y-4">
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                              <div class="relative">
                                                  <i data-lucide="user" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"></i>
                                                  <input type="text" name="name" placeholder="Nama lengkap Anda" required
                                                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                              </div>
                                          </div>
  
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                              <div class="relative">
                                                  <i data-lucide="mail" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"></i>
                                                  <input type="email" name="email" placeholder="nama@email.com" required
                                                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                              </div>
                                          </div>
  
                                          <div class="grid grid-cols-2 gap-4">
                                              <div>
                                                  <label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                                  <div class="relative">
                                                      <i data-lucide="phone" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"></i>
                                                      <input type="tel" name="phone" placeholder="+62 xxx xxx xxxx" required
                                                          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                                  </div>
                                              </div>
                                              <div>
                                                  <label class="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
                                                  <div class="relative">
                                                      <i data-lucide="map-pin" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"></i>
                                                      <input type="text" name="location" placeholder="Lokasi Anda" required
                                                          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                                  </div>
                                              </div>
                                          </div>
  
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                              <div class="relative">
                                                  <i data-lucide="lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"></i>
                                                  <input type="password" name="password" placeholder="Minimal 8 karakter" required minlength="8"
                                                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                              </div>
                                          </div>
  
                                          <div>
                                              <label class="flex items-start">
                                                  <input type="checkbox" required class="mr-2 mt-1">
                                                  <span class="text-sm">Saya setuju dengan <a href="#" class="text-green-600 hover:underline">Syarat & Ketentuan</a> dan <a href="#" class="text-green-600 hover:underline">Kebijakan Privasi</a></span>
                                              </label>
                                          </div>
  
                                          <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                                              Daftar Sekarang
                                          </button>
                                      </form>
                                  </div>
  
                                  <!-- Social Login -->
                                  <div class="mt-6">
                                      <div class="relative">
                                          <div class="absolute inset-0 flex items-center">
                                              <div class="w-full border-t border-gray-300"></div>
                                          </div>
                                          <div class="relative flex justify-center text-xs uppercase">
                                              <span class="bg-white px-2 text-gray-500">Atau masuk dengan</span>
                                          </div>
                                      </div>
  
                                      <div class="mt-4 grid grid-cols-2 gap-3">
                                          <button onclick="handleSocialLogin('Google')" class="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md">
                                              <i data-lucide="chrome" class="h-4 w-4"></i>
                                              Google
                                          </button>
                                          <button onclick="handleSocialLogin('Facebook')" class="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md">
                                              <i data-lucide="facebook" class="h-4 w-4"></i>
                                              Facebook
                                          </button>
                                      </div>
                                  </div>
  
                                  <div class="mt-6 text-center">
                                      <button onclick="navigateTo('home')" class="text-gray-600 hover:underline">
                                          Kembali ke Beranda
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;
  }
  
  function switchAuthTab(tab) {
      const loginForm = document.getElementById('login-form');
      const registerForm = document.getElementById('register-form');
      const title = document.getElementById('auth-title');
      const subtitle = document.getElementById('auth-subtitle');
      
      document.querySelectorAll('.auth-tab').forEach(btn => {
          btn.classList.remove('border-green-600', 'text-green-600');
          btn.classList.add('border-transparent', 'text-gray-500');
      });
      
      const activeTab = document.querySelector(`.auth-tab[data-tab="${tab}"]`);
      activeTab.classList.remove('border-transparent', 'text-gray-500');
      activeTab.classList.add('border-green-600', 'text-green-600');
      
      if (tab === 'login') {
          loginForm.classList.remove('hidden');
          registerForm.classList.add('hidden');
          title.textContent = 'Masuk ke Akun Anda';
          subtitle.textContent = 'Selamat datang kembali! Masuk untuk melanjutkan.';
      } else {
          loginForm.classList.add('hidden');
          registerForm.classList.remove('hidden');
          title.textContent = 'Daftar Sekarang';
          subtitle.textContent = 'Bergabunglah dengan komunitas petani modern Indonesia';
      }
      
      setTimeout(() => lucide.createIcons(), 100);
  }
  
  async function handleLoginSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const button = event.target.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      
      try {
          // Disable button and show loading
          button.disabled = true;
          button.textContent = 'Memproses...';
          
          const credentials = {
              email: formData.get('email'),
              password: formData.get('password')
          };
          
          // Call API
          const response = await API.login(credentials);
          
          if (response.success) {
              // Store user data with token
              const userData = {
                  ...response.data.user,
                  token: response.data.token
              };
              handleLogin(userData);
          } else {
              showAlert('error', response.message || 'Login gagal. Silakan coba lagi.');
          }
      } catch (error) {
          console.error('Login error:', error);
          showAlert('error', error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      } finally {
          button.disabled = false;
          button.textContent = originalText;
      }
  }
  
  async function handleRegisterSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const button = event.target.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      
      try {
          // Disable button and show loading
          button.disabled = true;
          button.textContent = 'Memproses...';
          
          const userData = {
              name: formData.get('name'),
              email: formData.get('email'),
              password: formData.get('password'),
              phone: formData.get('phone'),
              location: formData.get('location'),
              role: 'customer'
          };
          
          // Call API
          const response = await API.register(userData);
          
          if (response.success) {
              // Auto login after successful registration
              const loginData = {
                  ...response.data.user,
                  token: response.data.token
              };
              handleLogin(loginData);
              showAlert('success', 'Registrasi berhasil! Selamat datang di Tejoss.');
          } else {
              showAlert('error', response.message || 'Registrasi gagal. Silakan coba lagi.');
          }
      } catch (error) {
          console.error('Register error:', error);
          showAlert('error', error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      } finally {
          button.disabled = false;
          button.textContent = originalText;
      }
  }
  
  function handleSocialLogin(provider) {
      // Social login akan diimplementasikan dengan OAuth
      showAlert('info', `Fitur login dengan ${provider} akan segera tersedia!`);
  }
  
  // Payment Page
  function renderPaymentPage() {
      // Get service from AppState or session storage
      const selectedService = AppState.selectedService || JSON.parse(sessionStorage.getItem('selectedService') || '{}');
      
      if (!selectedService || !selectedService.id) {
          showAlert('error', 'Silakan pilih layanan terlebih dahulu');
          navigateTo('services');
          return '';
      }
  
      return `
          <div class="min-h-screen py-12 bg-gray-50">
              <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="text-center mb-12">
                      <h1 class="text-4xl font-bold text-gray-900 mb-4">Informasi Pemesanan</h1>
                      <p class="text-xl text-gray-600">Lengkapi informasi Anda untuk melanjutkan pemesanan</p>
                  </div>
  
                  <!-- Service Summary -->
                  <div class="card p-6 mb-6 bg-green-50">
                      <h3 class="font-semibold text-gray-900 mb-2">Layanan yang Dipilih:</h3>
                      <p class="text-lg">${selectedService.name}</p>
                      <p class="text-sm text-gray-600">${selectedService.description || ''}</p>
                      <p class="text-lg font-bold text-green-600 mt-2"> ${formatCurrency(selectedService.price || 0)} / ${selectedService.unit || 'unit'}</p>
                  </div>
  
                  <!-- Payment Form -->
                  <div class="card p-8">
                      <form onsubmit="handlePaymentSubmit(event)" class="space-y-6" id="payment-form">
                          <input type="hidden" name="service_id" value="${selectedService.id}">
                          
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                                  <input type="text" name="name" required placeholder="Masukkan nama lengkap"
                                      value="${AppState.user?.name || ''}"
                                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                              </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                  <input type="email" name="email" required placeholder="email@contoh.com"
                                      value="${AppState.user?.email || ''}"
                                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                              </div>
                          </div>
  
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon *</label>
                                  <input type="tel" name="phone" required placeholder="+62 812-3456-7890"
                                      value="${AppState.user?.phone || ''}"
                                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                              </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah (${selectedService.unit || 'unit'}) *</label>
                                  <input type="number" name="quantity" required placeholder="1" step="0.1" min="0.1" value="1"
                                      onchange="updatePriceSummary()"
                                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                              </div>
                          </div>
  
                          <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Lahan *</label>
                              <textarea name="location" required rows="3" placeholder="Alamat lengkap lokasi lahan"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                          </div>
  
                          <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Pelaksanaan *</label>
                              <input type="date" name="schedule_date" required
                                  min="${new Date().toISOString().split('T')[0]}"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                          </div>

                          <!-- Midtrans Payment Info -->
                          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                              <div class="flex items-start gap-3">
                                  <i data-lucide="alert-circle" class="h-5 w-5 text-blue-600 mt-0.5"></i>
                                  <div class="text-sm text-blue-900">
                                      <p class="font-semibold mb-2">Pembayaran Aman dengan Midtrans</p>
                                      <p class="text-blue-700">
                                          Anda akan diarahkan ke halaman pembayaran Midtrans yang aman. 
                                          Pilih metode pembayaran favorit Anda: Transfer Bank, E-Wallet, Kartu Kredit, atau Virtual Account.
                                      </p>
                                  </div>
                              </div>
                          </div>
  
                          <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                              <textarea name="notes" rows="3" placeholder="Informasi khusus atau permintaan tambahan..."
                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                          </div>
  
                          <div class="flex items-center">
                              <input type="checkbox" name="terms" required id="terms" class="mr-2">
                              <label for="terms" class="text-sm">
                                  Saya menyetujui <a href="#" class="text-green-600 underline">syarat dan ketentuan</a> yang berlaku
                              </label>
                          </div>
  
                          <!-- Price Summary -->
                          <div class="bg-green-50 p-6 rounded-lg" id="price-summary">
                              <h3 class="font-semibold text-gray-900 mb-4">Estimasi Harga</h3>
                              <div class="space-y-2 text-sm">
                                  <div class="flex justify-between">
                                      <span>Harga Layanan:</span>
                                      <span id="base-price"> ${formatCurrency(selectedService.price || 0)}</span>
                                  </div>
                                  <div class="flex justify-between">
                                      <span>Jumlah:</span>
                                      <span id="quantity-display">1 ${selectedService.unit || 'unit'}</span>
                                  </div>
                                  <div class="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span id="subtotal-price"> ${formatCurrency(selectedService.price || 0)}</span>
                                  </div>
                                  <div class="border-t pt-2 flex justify-between font-bold text-base">
                                      <span>Total:</span>
                                      <span class="text-green-600" id="total-price">     ${formatCurrency(selectedService.price || 0)}</span>
                                  </div>
                              </div>
                          </div>
  
                          <div class="flex gap-4">
                              <button type="button" onclick="navigateTo('services')" class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-md">
                                  Kembali ke Layanan
                              </button>
                              <button type="submit" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md">
                                  Buat Pesanan
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      `;
  }
  
  function updatePaymentDetails() {
      const paymentMethodSelect = document.getElementById('payment-method-select');
      const paymentDetailsDiv = document.getElementById('payment-details');
      
      if (!paymentMethodSelect || !paymentDetailsDiv) return;
      
      const method = paymentMethodSelect.value;
      let detailsHTML = '';
      
      if (method === 'transfer') {
          detailsHTML = `
              <div class="flex items-start gap-3">
                  <i data-lucide="building" class="h-5 w-5 text-blue-600 mt-0.5"></i>
                  <div class="text-sm">
                      <p class="font-semibold text-gray-900 mb-2">Transfer Bank</p>
                      <p class="text-gray-700 mb-1">Bank: BCA</p>
                      <p class="text-gray-700 mb-1">No. Rekening: 1234567890</p>
                      <p class="text-gray-700">a.n. PT Tejoss Agrikultur</p>
                  </div>
              </div>
          `;
      } else if (method === 'cash') {
          detailsHTML = `
              <div class="flex items-start gap-3">
                  <i data-lucide="wallet" class="h-5 w-5 text-blue-600 mt-0.5"></i>
                  <div class="text-sm">
                      <p class="font-semibold text-gray-900 mb-2">Pembayaran Tunai</p>
                      <p class="text-gray-700">Pembayaran dilakukan saat layanan selesai dikerjakan.</p>
                  </div>
              </div>
          `;
      } else if (method === 'ewallet') {
          detailsHTML = `
              <div class="flex items-start gap-3">
                  <i data-lucide="smartphone" class="h-5 w-5 text-blue-600 mt-0.5"></i>
                  <div class="text-sm">
                      <p class="font-semibold text-gray-900 mb-2">E-Wallet</p>
                      <p class="text-gray-700 mb-1">Tersedia: GoPay, OVO, DANA, LinkAja</p>
                      <p class="text-gray-700">Nomor akan dikirimkan setelah order dibuat.</p>
                  </div>
              </div>
          `;
      }
      
      paymentDetailsDiv.innerHTML = detailsHTML;
      
      // Re-initialize Lucide icons for the new content
      if (typeof lucide !== 'undefined') {
          lucide.createIcons();
      }
  }
  
  function updatePriceSummary() {
      const selectedService = AppState.selectedService || JSON.parse(sessionStorage.getItem('selectedService') || '{}');
      const quantityInput = document.querySelector('input[name="quantity"]');
      
      if (!quantityInput || !selectedService.price) return;
      
      const quantity = parseFloat(quantityInput.value) || 1;
      const basePrice = selectedService.price;
      const subtotal = basePrice * quantity;
      
      document.getElementById('quantity-display').textContent = `${quantity} ${selectedService.unit || 'unit'}`;
      document.getElementById('subtotal-price').textContent = `Rp ${formatCurrency(subtotal)}`;
      document.getElementById('total-price').textContent = `Rp ${formatCurrency(subtotal)}`;
  }
  
  async function handlePaymentSubmit(event) {
      event.preventDefault();
      
      if (!AppState.user) {
          showAlert('error', 'Silakan login terlebih dahulu');
          navigateTo('login');
          return;
      }
      
      const formData = new FormData(event.target);
      const button = event.target.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      
      try {
          // Disable button and show loading
          button.disabled = true;
          button.textContent = 'Memproses...';
          
          const orderData = {
              service_id: parseInt(formData.get('service_id')),
              quantity: parseFloat(formData.get('quantity')),
              location: formData.get('location'),
              schedule_date: formData.get('schedule_date'),
              notes: formData.get('notes'),
              payment_method: formData.get('payment_method')
          };
          
          // Call API to create order
          const response = await API.createOrder(orderData);
          
          if (response.success) {
              showAlert('success', 'Pesanan berhasil dibuat! Silakan lakukan pembayaran.');
              
              // Clear selected service from state
              AppState.selectedService = null;
              sessionStorage.removeItem('selectedService');
              
              // Navigate to my orders page after delay
              setTimeout(() => {
                  navigateTo('myorders');
              }, 1500);
          } else {
              showAlert('error', response.message || 'Gagal membuat pesanan. Silakan coba lagi.');
          }
      } catch (error) {
          console.error('Order creation error:', error);
          showAlert('error', error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      } finally {
          button.disabled = false;
          button.textContent = originalText;
      }
  }
  
  // My Orders Page
  function renderMyOrdersPage() {
      if (!AppState.user) {
          navigateTo('login');
          showAlert('info', 'Silakan login terlebih dahulu untuk melihat pesanan Anda.');
          return '';
      }
  
      // Show loading state
      const loadingHTML = `
          <div class="min-h-screen py-12 bg-gray-50">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="text-center py-20">
                      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                      <p class="mt-4 text-gray-600">Memuat pesanan...</p>
                  </div>
              </div>
          </div>
      `;
  
      // Load orders from API
      setTimeout(async () => {
          try {
              const response = await API.getOrders();
              const orders = response.data || [];
              
              // Map orders to expected format
              const mappedOrders = orders.map(order => ({
                  id: order.order_number,
                  service: order.service_name,
                  farmSize: `${order.quantity} ${order.unit}`,
                  location: order.location,
                  orderDate: order.created_at,
                  serviceDate: order.schedule_date,
                  totalPrice: order.total_price,
                  status: order.status,
                  payment_status: order.payment_status,
                  orderId: order.id, // Keep actual DB id for API calls
                  timeline: order.timeline || []
              }));
  
              renderOrdersList(mappedOrders);
          } catch (error) {
              console.error('Error loading orders:', error);
              renderOrdersError(error.message);
          }
      }, 100);
  
      return loadingHTML;
  }
  
  function renderOrdersList(orders) {
      const content = `
          <div class="min-h-screen py-12 bg-gray-50">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="mb-8">
                      <h1 class="text-4xl font-bold text-gray-900 mb-4">Pesanan Saya</h1>
                      <p class="text-xl text-gray-600">Kelola dan pantau semua pesanan layanan pertanian Anda</p>
                  </div>
  
                  <!-- Stats Cards -->
                  <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                      <div class="card p-4">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm text-gray-600">Total</p>
                                  <p class="text-2xl font-bold">${orders.length}</p>
                              </div>
                              <i data-lucide="package" class="h-8 w-8 text-gray-400"></i>
                          </div>
                      </div>
                      <div class="card p-4">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm text-gray-600">Selesai</p>
                                  <p class="text-2xl font-bold text-green-600">${orders.filter(o => o.status === 'completed').length}</p>
                              </div>
                              <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                          </div>
                      </div>
                      <div class="card p-4">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm text-gray-600">Berjalan</p>
                                  <p class="text-2xl font-bold text-blue-600">${orders.filter(o => o.status === 'in_progress').length}</p>
                              </div>
                              <i data-lucide="clock" class="h-8 w-8 text-blue-400"></i>
                          </div>
                      </div>
                      <div class="card p-4">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm text-gray-600">Terjadwal</p>
                                  <p class="text-2xl font-bold text-yellow-600">${orders.filter(o => o.status === 'scheduled').length}</p>
                              </div>
                              <i data-lucide="calendar" class="h-8 w-8 text-yellow-400"></i>
                          </div>
                      </div>
                      <div class="card p-4">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm text-gray-600">Dibatalkan</p>
                                  <p class="text-2xl font-bold text-red-600">${orders.filter(o => o.status === 'cancelled').length}</p>
                              </div>
                              <i data-lucide="x-circle" class="h-8 w-8 text-red-400"></i>
                          </div>
                      </div>
                  </div>
  
                  <!-- Orders List -->
                  <div class="space-y-6">
                      ${orders.length > 0 ? 
                          orders.map(order => renderOrderCard(order)).join('') :
                          `<div class="card p-12 text-center">
                              <i data-lucide="inbox" class="h-16 w-16 mx-auto text-gray-300 mb-4"></i>
                              <h3 class="text-xl font-semibold text-gray-900 mb-2">Belum Ada Pesanan</h3>
                              <p class="text-gray-600 mb-6">Anda belum memiliki pesanan. Pesan layanan pertama Anda sekarang!</p>
                              <button onclick="navigateTo('services')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                                  Lihat Layanan
                              </button>
                          </div>`
                      }
                  </div>
  
                  ${orders.length > 0 ? `
                  <!-- Quick Actions -->
                  <div class="mt-12 text-center">
                      <h3 class="text-xl font-semibold text-gray-900 mb-6">Butuh layanan lagi?</h3>
                      <div class="flex flex-col sm:flex-row gap-4 justify-center">
                          <button onclick="navigateTo('services')" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md">
                              Pesan Layanan Baru
                          </button>
                          <button onclick="navigateTo('home')" class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md">
                              Kembali ke Beranda
                          </button>
                      </div>
                  </div>
                  ` : ''}
              </div>
          </div>
      `;
      
      document.getElementById('app-content').innerHTML = content;
      lucide.createIcons();
  }
  
  function renderOrdersError(message) {
      const errorHTML = `
          <div class="min-h-screen py-12 bg-gray-50">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="card p-12 text-center">
                      <i data-lucide="alert-circle" class="h-16 w-16 mx-auto text-red-500 mb-4"></i>
                      <h3 class="text-xl font-semibold text-gray-900 mb-2">Gagal Memuat Pesanan</h3>
                      <p class="text-gray-600 mb-6">${message || 'Terjadi kesalahan saat memuat data pesanan'}</p>
                      <button onclick="navigateTo('myorders')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                          Coba Lagi
                      </button>
                  </div>
              </div>
          </div>
      `;
      document.getElementById('app-content').innerHTML = errorHTML;
      lucide.createIcons();
  }
  
  function renderOrderCard(order) {
      const statusColors = {
          completed: 'status-completed',
          in_progress: 'status-in-progress',
          scheduled: 'status-scheduled',
          cancelled: 'status-cancelled',
          pending: 'status-pending'
      };
  
      const statusText = {
          completed: 'Selesai',
          in_progress: 'Dalam Proses',
          scheduled: 'Terjadwal',
          cancelled: 'Dibatalkan',
          pending: 'Menunggu'
      };
      
      // Clean service name for use in HTML attribute
      const serviceNameClean = order.service.replace(/'/g, '');
  
      return `
          <div class="card">
              <div class="p-6">
                  <div class="flex justify-between items-start mb-4">
                      <div>
                          <h3 class="text-lg font-semibold text-gray-900 mb-2">${order.service} - ${order.farmSize}</h3>
                          <div class="flex items-center gap-4 text-sm text-gray-600">
                              <span class="flex items-center gap-1">
                                  <i data-lucide="package" class="h-4 w-4"></i>
                                  ${order.id}
                              </span>
                              <span class="flex items-center gap-1">
                                  <i data-lucide="calendar" class="h-4 w-4"></i>
                                  ${formatDate(order.serviceDate)}
                              </span>
                              <span class="flex items-center gap-1">
                                  <i data-lucide="map-pin" class="h-4 w-4"></i>
                                  ${order.location}
                              </span>
                          </div>
                      </div>
                      <span class="badge ${statusColors[order.status]}">${statusText[order.status]}</span>
                  </div>
  
                  <div class="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <div>
                          Total: <span class="font-semibold text-gray-900">${formatCurrency(order.totalPrice)}</span>
                      </div>
                      <div>
                          Dipesan: ${formatDate(order.orderDate)}
                      </div>
                  </div>
  
                  <!-- Timeline Progress -->
                  ${order.timeline && order.timeline.length > 0 ? `
                  <div class="mb-4">
                      <div class="flex items-center gap-2 overflow-x-auto pb-2">
                          ${order.timeline.map((item, index) => `
                              <div class="flex items-center gap-2 whitespace-nowrap">
                                  <div class="p-2 rounded-full ${index === order.timeline.length - 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}">
                                      <i data-lucide="check-circle" class="h-4 w-4"></i>
                                  </div>
                                  ${index < order.timeline.length - 1 ? '<div class="w-8 h-0.5 bg-gray-200"></div>' : ''}
                              </div>
                          `).join('')}
                      </div>
                      <p class="text-sm text-gray-600 mt-2">
                          Status terakhir: ${order.timeline[order.timeline.length - 1].description}
                      </p>
                  </div>
                  ` : ''}
  
                  <!-- Payment Status Badge -->
                  ${order.payment_status ? `
                  <div class="mb-3">
                      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                          order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                      }">
                          ${order.payment_status === 'paid' ? '✅ Lunas' : 
                            order.payment_status === 'pending' ? '⏳ Menunggu Pembayaran' : 
                            '❌ Belum Dibayar'}
                      </span>
                  </div>
                  ` : ''}
                  
                  <div class="flex gap-2 flex-wrap">
                      <button onclick="showOrderDetail(${order.orderId})" class="flex-1 border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-md text-sm">
                          Lihat Detail
                      </button>
                      
                      ${(order.payment_status === 'unpaid' || order.payment_status === 'pending') ? `
                          <button onclick="payWithMidtrans(${order.orderId}, '${order.id}')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1">
                              <i data-lucide="credit-card" class="h-4 w-4"></i>
                              Bayar Sekarang
                          </button>
                          <button onclick="refreshPaymentStatus(${order.orderId}, '${order.id}')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1" title="Refresh status pembayaran jika Anda sudah membayar">
                              <i data-lucide="refresh-cw" class="h-4 w-4"></i>
                              Cek Status
                          </button>
                      ` : ''}
                      
                      ${order.status === 'completed' ? `
                          <button onclick="showTestimonialModal(${order.orderId}, '${order.service.replace(/'/g, "\\'")}')\" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1">
                              <i data-lucide="star" class="h-4 w-4"></i>
                              Beri Testimoni
                          </button>
                      ` : ''}
                      
                      ${order.status !== 'cancelled' && order.status !== 'completed' && order.payment_status !== 'paid' ? `
                          <button onclick="handleCancelOrder('${order.orderId}', '${order.id}')" class="border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md text-sm">
                              Batalkan
                          </button>
                      ` : ''}
                  </div>
              </div>
          </div>
      `;
  }
  
  // Note: showOrderDetail is now defined in pages-api-helpers.js and available globally
  
  async function handleCancelOrder(orderId, orderNumber) {
      // Confirm cancellation
      const confirmed = confirm(`Apakah Anda yakin ingin membatalkan pesanan ${orderNumber}?`);
      
      if (!confirmed) {
          return;
      }
      
      const reason = prompt('Alasan pembatalan (opsional):') || 'Dibatalkan oleh pelanggan';
      
      try {
          const success = await cancelOrder(orderId, reason);
          
          if (success) {
              // Reload orders
              navigateTo('myorders');
          }
      } catch (error) {
          console.error('Error canceling order:', error);
          showAlert('error', 'Gagal membatalkan pesanan');
      }
  }
  
  // ==================== PROFILE & SETTINGS PAGE ====================
  
  function renderProfileSettings() {
      // Check authentication first
      if (!isAuthenticated()) {
          showAlert('warning', 'Silakan login terlebih dahulu untuk mengakses halaman profil.');
          navigateTo('login');
          return '';
      }
      
      const loadingHTML = `
          <div class="min-h-screen py-12 bg-gray-50">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="text-center py-20">
                      <div class="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
                      <p class="text-gray-600 mt-4">Memuat profil...</p>
                  </div>
              </div>
          </div>
      `;
      
      // Load data asynchronously after rendering
      setTimeout(async () => {
          try {
              // Double check authentication before loading data
              if (!isAuthenticated()) {
                  showAlert('warning', 'Sesi Anda telah berakhir. Silakan login kembali.');
                  navigateTo('login');
                  return;
              }
              
              // Refresh user data to get stats
              const userResponse = await API.getMe();
              if (userResponse.success && userResponse.data) {
                  // Update AppState with fresh user data including stats
                  AppState.user = { ...AppState.user, ...userResponse.data };
                  // Update localStorage
                  const storedUser = JSON.parse(localStorage.getItem('tejoss_user'));
                  localStorage.setItem('tejoss_user', JSON.stringify({ ...storedUser, ...userResponse.data }));
              }
              
              // Load user testimonials
              const testimonials = await loadTestimonials({ userId: AppState.user.id });
              renderProfileContent(testimonials);
          } catch (error) {
              console.error('Error loading profile:', error);
              
              // Check if error is auth related
              if (error.message && error.message.includes('berakhir')) {
                  // Already handled in api.js
                  return;
              }
              
              renderProfileContent([]);
          }
      }, 100);
      
      return loadingHTML;
  }
  
  function renderProfileContent(testimonials) {
      const user = AppState.user;
      const totalTestimonials = user.stats?.total_testimonials || testimonials.length || 0;
      const totalOrders = user.stats?.total_orders || 0;
      
      const content = `
          <div class="min-h-screen py-12 bg-gray-50">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="mb-8">
                      <h1 class="text-4xl font-bold text-gray-900 mb-4">Profil & Pengaturan</h1>
                      <p class="text-xl text-gray-600">Kelola informasi akun dan testimoni Anda</p>
                  </div>
                  
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <!-- Sidebar Profile Card -->
                      <div class="lg:col-span-1">
                          <div class="card p-6 text-center sticky top-24">
                              <div class="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                                  ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <h2 class="text-xl font-bold text-gray-900 mb-1">${user.name || 'User'}</h2>
                              <p class="text-gray-600 mb-4">${user.email || ''}</p>
                              <div class="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                                  <i data-lucide="calendar" class="h-4 w-4"></i>
                                  Bergabung ${user.createdAt ? formatDate(user.createdAt) : 'baru saja'}
                              </div>
                              <div class="border-t pt-4">
                                  <div class="flex justify-around text-center">
                                      <div>
                                          <p class="text-2xl font-bold text-green-600">${totalTestimonials}</p>
                                          <p class="text-xs text-gray-600">Testimoni</p>
                                      </div>
                                      <div>
                                          <p class="text-2xl font-bold text-blue-600">${totalOrders}</p>
                                          <p class="text-xs text-gray-600">Pesanan</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <!-- Main Content -->
                      <div class="lg:col-span-2 space-y-6">
                          <!-- Tabs -->
                          <div class="card">
                              <div class="border-b">
                                  <nav class="flex">
                                      <button onclick="switchProfileTab('info')" class="profile-tab px-6 py-4 text-sm font-medium border-b-2 border-green-600 text-green-600" data-tab="info">
                                          <i data-lucide="user" class="h-4 w-4 inline mr-2"></i>
                                          Informasi Pribadi
                                      </button>
                                      <button onclick="switchProfileTab('password')" class="profile-tab px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="password">
                                          <i data-lucide="lock" class="h-4 w-4 inline mr-2"></i>
                                          Ubah Password
                                      </button>
                                      <button onclick="switchProfileTab('testimonials')" class="profile-tab px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="testimonials">
                                          <i data-lucide="message-square" class="h-4 w-4 inline mr-2"></i>
                                          Testimoni Saya
                                      </button>
                                  </nav>
                              </div>
                              
                              <!-- Tab Contents -->
                              <div class="p-6">
                                  <!-- Info Tab -->
                                  <div id="profile-info-tab" class="profile-tab-content">
                                      <h3 class="text-lg font-semibold text-gray-900 mb-4">Informasi Pribadi</h3>
                                      <form onsubmit="handleUpdateProfile(event)" class="space-y-4">
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                              <input type="text" name="name" value="${user.name || ''}" required
                                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                          </div>
                                          
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                              <input type="email" value="${user.email || ''}" disabled
                                                  class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed">
                                              <p class="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                                          </div>
                                          
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                              <input type="tel" name="phone" value="${user.phone || ''}" placeholder="08xx-xxxx-xxxx"
                                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                          </div>
                                          
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                              <textarea name="address" rows="3" placeholder="Alamat lengkap"
                                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">${user.address || ''}</textarea>
                                          </div>
                                          
                                          <div class="flex gap-3">
                                              <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                                                  <i data-lucide="save" class="h-4 w-4 inline mr-2"></i>
                                                  Simpan Perubahan
                                              </button>
                                              <button type="button" onclick="location.reload()" class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md">
                                                  Batal
                                              </button>
                                          </div>
                                      </form>
                                  </div>
                                  
                                  <!-- Password Tab -->
                                  <div id="profile-password-tab" class="profile-tab-content hidden">
                                      <h3 class="text-lg font-semibold text-gray-900 mb-4">Ubah Password</h3>
                                      <form onsubmit="handleChangePassword(event)" class="space-y-4">
                                          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                                              <div class="flex items-start gap-2">
                                                  <i data-lucide="info" class="h-5 w-5 text-blue-600 mt-0.5"></i>
                                                  <div>
                                                      <p class="text-sm font-medium text-blue-900">Tips Password Aman</p>
                                                      <ul class="text-sm text-blue-700 mt-1 list-disc list-inside">
                                                          <li>Minimal 8 karakter</li>
                                                          <li>Gunakan kombinasi huruf besar, kecil, angka, dan simbol</li>
                                                          <li>Jangan gunakan password yang mudah ditebak</li>
                                                      </ul>
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                                              <input type="password" name="currentPassword" required
                                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                          </div>
                                          
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                              <input type="password" name="newPassword" required minlength="8"
                                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                          </div>
                                          
                                          <div>
                                              <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                                              <input type="password" name="confirmPassword" required minlength="8"
                                                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                          </div>
                                          
                                          <div class="flex gap-3">
                                              <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                                                  <i data-lucide="lock" class="h-4 w-4 inline mr-2"></i>
                                                  Ubah Password
                                              </button>
                                              <button type="reset" class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md">
                                                  Reset
                                              </button>
                                          </div>
                                      </form>
                                  </div>
                                  
                                  <!-- Testimonials Tab -->
                                  <div id="profile-testimonials-tab" class="profile-tab-content hidden">
                                      <div class="flex justify-between items-center mb-4">
                                          <h3 class="text-lg font-semibold text-gray-900">Testimoni Saya</h3>
                                          <button onclick="showTestimonialModal()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                                              <i data-lucide="plus" class="h-4 w-4 inline mr-1"></i>
                                              Tulis Testimoni
                                          </button>
                                      </div>
                                      
                                      ${testimonials.length > 0 ? `
                                          <div class="space-y-4">
                                              ${testimonials.map(t => `
                                                  <div class="border border-gray-200 rounded-lg p-4">
                                                      <div class="flex items-start justify-between mb-2">
                                                          <div class="flex items-center gap-1">
                                                              ${Array(t.rating || 5).fill().map(() => '<i data-lucide="star" class="h-4 w-4 text-yellow-400 fill-current"></i>').join('')}
                                                          </div>
                                                          <span class="text-xs px-2 py-1 rounded-full ${
                                                              t.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                              t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                              'bg-gray-100 text-gray-800'
                                                          }">
                                                              ${t.status === 'approved' ? 'Disetujui' : t.status === 'pending' ? 'Menunggu Review' : 'Draft'}
                                                          </span>
                                                      </div>
                                                      <p class="text-gray-700 mb-2">${t.message || ''}</p>
                                                      ${t.service_name ? `<p class="text-sm text-gray-500">Layanan: ${t.service_name}</p>` : ''}
                                                      <p class="text-xs text-gray-400 mt-2">${formatDate(t.created_at)}</p>
                                                  </div>
                                              `).join('')}
                                          </div>
                                      ` : `
                                          <div class="text-center py-12">
                                              <i data-lucide="message-square" class="h-16 w-16 mx-auto text-gray-300 mb-4"></i>
                                              <p class="text-gray-600 mb-4">Anda belum memberikan testimoni</p>
                                              <button onclick="showTestimonialModal()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                                                  Tulis Testimoni Pertama
                                              </button>
                                          </div>
                                      `}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;
      
      document.getElementById('app-content').innerHTML = content;
      lucide.createIcons();
  }
  
  function switchProfileTab(tabName) {
      // Update tab buttons
      document.querySelectorAll('.profile-tab').forEach(tab => {
          if (tab.dataset.tab === tabName) {
              tab.classList.remove('border-transparent', 'text-gray-500');
              tab.classList.add('border-green-600', 'text-green-600');
          } else {
              tab.classList.remove('border-green-600', 'text-green-600');
              tab.classList.add('border-transparent', 'text-gray-500');
          }
      });
      
      // Update tab content
      document.querySelectorAll('.profile-tab-content').forEach(content => {
          content.classList.add('hidden');
      });
      document.getElementById(`profile-${tabName}-tab`).classList.remove('hidden');
      
      lucide.createIcons();
  }
  
  async function handleUpdateProfile(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      
      const profileData = {
          name: formData.get('name'),
          phone: formData.get('phone'),
          address: formData.get('address')
      };
      
      const success = await updateUserProfile(profileData);
      if (success) {
    document.getElementById('app-content').innerHTML = renderProfileSettings();  // ✅ Update DOM dengan hasil
    lucide.createIcons();
}
  }
  
  async function handleChangePassword(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');
      
      if (newPassword !== confirmPassword) {
          showAlert('error', 'Password baru dan konfirmasi password tidak cocok!');
          return;
      }
      
      const passwordData = {
          currentPassword: formData.get('currentPassword'),
          newPassword: newPassword
      };
      
      const success = await changeUserPassword(passwordData);
      if (success) {
          event.target.reset();
      }
  }
  
  function showTestimonialModal(orderId = null, serviceName = null) {
      // Check authentication first
      if (!isAuthenticated()) {
          showAlert('warning', 'Sesi Anda telah berakhir. Silakan login kembali.');
          navigateTo('login');
          return;
      }
      
      const modalHTML = `
          <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" id="testimonial-modal" onclick="closeTestimonialModal(event)">
              <div class="bg-white rounded-lg max-w-lg w-full p-6" onclick="event.stopPropagation()">
                  <div class="flex justify-between items-center mb-4">
                      <h3 class="text-xl font-bold text-gray-900">Tulis Testimoni</h3>
                      <button onclick="closeTestimonialModal()" class="text-gray-400 hover:text-gray-600">
                          <i data-lucide="x" class="h-6 w-6"></i>
                      </button>
                  </div>
                  
                  <form onsubmit="handleSubmitTestimonial(event, ${orderId})" class="space-y-4">
                      ${serviceName ? `
                          <div class="bg-green-50 border border-green-200 rounded-md p-3">
                              <p class="text-sm text-green-800">
                                  <i data-lucide="info" class="h-4 w-4 inline mr-1"></i>
                                  Testimoni untuk: <strong>${serviceName}</strong>
                              </p>
                          </div>
                      ` : ''}
                      
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                              Rating <span class="text-red-500">*</span>
                          </label>
                          <div class="flex gap-2" id="rating-stars">
                              ${[1,2,3,4,5].map(num => `
                                  <button type="button" onclick="setRating(${num})" class="rating-star text-gray-300 hover:text-yellow-400 transition" data-rating="${num}">
                                      <i data-lucide="star" class="h-8 w-8"></i>
                                  </button>
                              `).join('')}
                          </div>
                          <input type="hidden" name="rating" id="rating-value" required>
                      </div>
                      
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                              Testimoni Anda <span class="text-red-500">*</span>
                          </label>
                          <textarea name="message" rows="4" required placeholder="Ceritakan pengalaman Anda menggunakan layanan kami..."
                              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                          <p class="text-xs text-gray-500 mt-1">Minimal 10 karakter</p>
                      </div>
                      
                      ${!orderId ? `
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Layanan (Opsional)</label>
                          <input type="text" name="service_name" placeholder="Contoh: Jasa Panen Padi"
                              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      </div>
                      ` : ''}
                      
                      <div class="flex gap-3 pt-2">
                          <button type="submit" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                              <i data-lucide="send" class="h-4 w-4 inline mr-2"></i>
                              Kirim Testimoni
                          </button>
                          <button type="button" onclick="closeTestimonialModal()" class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md">
                              Batal
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      lucide.createIcons();
  }
  
  function closeTestimonialModal(event) {
      if (event && event.target.id !== 'testimonial-modal') return;
      const modal = document.getElementById('testimonial-modal');
      if (modal) modal.remove();
  }
  
  function setRating(rating) {
      document.getElementById('rating-value').value = rating;
      
      document.querySelectorAll('.rating-star').forEach(star => {
          const starRating = parseInt(star.dataset.rating);
          
          // Lucide converts <i> to <svg>, so we need to target both
          const icon = star.querySelector('i') || star.querySelector('svg');
          
          if (starRating <= rating) {
              star.classList.remove('text-gray-300');
              star.classList.add('text-yellow-400');
              if (icon) {
                  icon.classList.remove('text-gray-300');
                  icon.classList.add('text-yellow-400', 'fill-current');
              }
          } else {
              star.classList.remove('text-yellow-400');
              star.classList.add('text-gray-300');
              if (icon) {
                  icon.classList.remove('text-yellow-400', 'fill-current');
                  icon.classList.add('text-gray-300');
              }
          }
      });
  }
  
  async function handleSubmitTestimonial(event, orderId = null) {
      event.preventDefault();
      
      // Check authentication first
      if (!isAuthenticated()) {
          closeTestimonialModal();
          showAlert('warning', 'Sesi Anda telah berakhir. Silakan login kembali.');
          navigateTo('login');
          return;
      }
      
      const formData = new FormData(event.target);
      
      const rating = formData.get('rating');
      if (!rating) {
          showAlert('error', 'Silakan berikan rating terlebih dahulu');
          return;
      }
      
      const message = formData.get('message');
      if (!message || message.trim().length < 10) {
          showAlert('error', 'Testimoni minimal 10 karakter');
          return;
      }
      
      const testimonialData = {
          rating: parseInt(rating),
          message: message.trim(),
          service_name: formData.get('service_name') || null,
          order_id: orderId ? parseInt(orderId) : null
      };
      
      // DEBUG: Log testimonial data being sent
      console.log('=== SENDING TESTIMONIAL ===');
      console.log('Testimonial Data:', testimonialData);
      console.log('Original orderId:', orderId, 'Type:', typeof orderId);
      console.log('Parsed order_id:', testimonialData.order_id, 'Type:', typeof testimonialData.order_id);
      
      const success = await createTestimonial(testimonialData);
      if (success) {
          closeTestimonialModal();
          
          // If on profile page, reload testimonials
          if (window.location.hash === '#profile') {
          document.getElementById('app-content').innerHTML = renderProfileSettings();  // ✅ Update DOM dengan hasil
    lucide.createIcons();
          } else if (window.location.hash === '#myorders') {
              navigateTo('myorders');
          }
      }
  }

  // Export functions to global window
  window.renderProfileSettings = renderProfileSettings;
  window.switchProfileTab = switchProfileTab;
  window.handleUpdateProfile = handleUpdateProfile;
  window.handleChangePassword = handleChangePassword;
  window.showTestimonialModal = showTestimonialModal;
  window.closeTestimonialModal = closeTestimonialModal;
  window.setRating = setRating;
  window.handleSubmitTestimonial = handleSubmitTestimonial;
  window.updatePaymentDetails = updatePaymentDetails;
  window.updatePriceSummary = updatePriceSummary;
  window.handleCancelOrder = handleCancelOrder;
  
  // Add event delegation for testimonial buttons using data attributes
  document.addEventListener('click', function(e) {
      const testimonialBtn = e.target.closest('[data-testimonial-btn]');
      if (testimonialBtn) {
          const orderId = testimonialBtn.getAttribute('data-order-id');
          const serviceName = testimonialBtn.getAttribute('data-service-name');
          showTestimonialModal(orderId, serviceName);
      }
  });