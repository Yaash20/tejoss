// Admin Panel - Professional Dashboard
// This file handles all admin panel functionality

// Global state for admin panel
const AdminState = {
    currentSection: 'dashboard',
    stats: null,
    selectedItem: null
};

// Render Admin Panel Main Layout
function renderAdminPanel() {
    if (!AppState.user || AppState.user.role !== 'admin') {
        navigateTo('home');
        showAlert('error', 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.');
        return '';
    }

    const html = `
        <div class="admin-panel">
            <!-- Sidebar -->
            <aside class="admin-sidebar">
                <div class="admin-logo">
                    <h2>🌾 TEJOSS Admin</h2>
                    <p>Panel Administrasi</p>
                </div>
                
                <nav class="admin-nav">
                    <a href="#" class="admin-nav-item ${AdminState.currentSection === 'dashboard' ? 'active' : ''}" onclick="showAdminSection('dashboard'); return false;">
                        <i data-lucide="layout-dashboard"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="#" class="admin-nav-item ${AdminState.currentSection === 'services' ? 'active' : ''}" onclick="showAdminSection('services'); return false;">
                        <i data-lucide="package"></i>
                        <span>Kelola Layanan</span>
                    </a>
                    <a href="#" class="admin-nav-item ${AdminState.currentSection === 'orders' ? 'active' : ''}" onclick="showAdminSection('orders'); return false;">
                        <i data-lucide="shopping-cart"></i>
                        <span>Kelola Pesanan</span>
                    </a>
                    <a href="#" class="admin-nav-item ${AdminState.currentSection === 'customers' ? 'active' : ''}" onclick="showAdminSection('customers'); return false;">
                        <i data-lucide="users"></i>
                        <span>Kelola Pelanggan</span>
                    </a>
                    <a href="#" class="admin-nav-item ${AdminState.currentSection === 'testimonials' ? 'active' : ''}" onclick="showAdminSection('testimonials'); return false;">
                        <i data-lucide="star"></i>
                        <span>Kelola Testimoni</span>
                    </a>
                    <a href="#" class="admin-nav-item ${AdminState.currentSection === 'analytics' ? 'active' : ''}" onclick="showAdminSection('analytics'); return false;">
                        <i data-lucide="bar-chart-3"></i>
                        <span>Analitik & Laporan</span>
                    </a>
                    <a href="#" class="admin-nav-item ${AdminState.currentSection === 'settings' ? 'active' : ''}" onclick="showAdminSection('settings'); return false;">
                        <i data-lucide="settings"></i>
                        <span>Pengaturan</span>
                    </a>
                </nav>

                <div class="admin-sidebar-footer">
                    <div class="admin-user-info">
                        <div class="admin-user-avatar">
                            <i data-lucide="user"></i>
                        </div>
                        <div>
                            <p class="admin-user-name">${AppState.user.name}</p>
                            <p class="admin-user-role">Administrator</p>
                        </div>
                    </div>
                    <button onclick="handleLogout()" class="btn-logout">
                        <i data-lucide="log-out"></i>
                        Logout
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="admin-main">
                <div id="admin-content">
                    <!-- Content will be loaded here -->
                </div>
            </main>
        </div>
    `;

    const appContent = document.getElementById('app-content');
    appContent.innerHTML = html;
    lucide.createIcons();

    // Load default section
    showAdminSection('dashboard');
}

// Show Admin Section
async function showAdminSection(section) {
    AdminState.currentSection = section;
    
    // Update active state in navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event?.target?.closest('.admin-nav-item')?.classList.add('active');

    const contentDiv = document.getElementById('admin-content');
    
    // Show loading
    contentDiv.innerHTML = `
        <div class="admin-loading">
            <div class="spinner"></div>
            <p>Memuat data...</p>
        </div>
    `;

    try {
        switch (section) {
            case 'dashboard':
                await renderDashboard();
                break;
            case 'services':
                await renderServicesManagement();
                break;
            case 'orders':
                await renderOrdersManagement();
                break;
            case 'customers':
                await renderCustomersManagement();
                break;
            case 'testimonials':
                await renderTestimonialsManagement();
                break;
            case 'analytics':
                await renderAnalytics();
                break;
            case 'settings':
                await renderSettings();
                break;
            default:
                contentDiv.innerHTML = '<p>Section not found</p>';
        }
    } catch (error) {
        console.error('Error loading section:', error);
        contentDiv.innerHTML = `
            <div class="admin-error">
                <i data-lucide="alert-circle"></i>
                <p>Gagal memuat data. Silakan coba lagi.</p>
            </div>
        `;
        lucide.createIcons();
    }
}

// ============================================
// DASHBOARD SECTION
// ============================================
async function renderDashboard() {
    try {
        // Fetch all stats in parallel
        const [ordersRes, servicesRes, customersRes, testimonialsRes] = await Promise.all([
            fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${AppState.user.token}` }
            }),
            fetch(`${API_CONFIG.BASE_URL}/api/services`),
            fetch(`${API_CONFIG.BASE_URL}/api/auth?action=users`, {
                headers: { 'Authorization': `Bearer ${AppState.user.token}` }
            }),
            fetch(`${API_CONFIG.BASE_URL}/api/testimonials?action=all`, {
                headers: { 'Authorization': `Bearer ${AppState.user.token}` }
            })
        ]);

        const ordersData = await ordersRes.json();
        const servicesData = await servicesRes.json();
        const customersData = await customersRes.json();
        const testimonialsData = await testimonialsRes.json();

        const orders = ordersData.data || [];
        const services = servicesData.data || [];
        const customers = customersData.data || [];
        const testimonials = testimonialsData.data || [];

        // Calculate stats
        const totalRevenue = orders
            .filter(o => o.payment_status === 'paid')
            .reduce((sum, o) => sum + parseFloat(o.total_price), 0);

        const pendingOrders = orders.filter(o => o.payment_status === 'unpaid' || o.payment_status === 'pending').length;
        const activeOrders = orders.filter(o => o.status === 'in_progress').length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const pendingTestimonials = testimonials.filter(t => !t.is_approved).length;

        // Recent orders
        const recentOrders = orders.slice(0, 5);

        const html = `
            <div class="admin-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Selamat datang kembali, ${AppState.user.name}!</p>
                </div>
                <div class="admin-header-actions">
                    <button onclick="location.reload()" class="btn-secondary">
                        <i data-lucide="refresh-cw"></i>
                        Refresh
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="admin-stats-grid">
                <div class="admin-stat-card stat-primary">
                    <div class="stat-icon">
                        <i data-lucide="dollar-sign"></i>
                    </div>
                    <div class="stat-content">
                        <p class="stat-label">Total Pendapatan</p>
                        <h3 class="stat-value">Rp ${formatCurrency(totalRevenue)}</h3>
                        <p class="stat-change positive">+12.5% dari bulan lalu</p>
                    </div>
                </div>

                <div class="admin-stat-card stat-warning">
                    <div class="stat-icon">
                        <i data-lucide="clock"></i>
                    </div>
                    <div class="stat-content">
                        <p class="stat-label">Pesanan Pending</p>
                        <h3 class="stat-value">${pendingOrders}</h3>
                        <p class="stat-desc">Menunggu pembayaran</p>
                    </div>
                </div>

                <div class="admin-stat-card stat-success">
                    <div class="stat-icon">
                        <i data-lucide="trending-up"></i>
                    </div>
                    <div class="stat-content">
                        <p class="stat-label">Pesanan Aktif</p>
                        <h3 class="stat-value">${activeOrders}</h3>
                        <p class="stat-desc">Sedang diproses</p>
                    </div>
                </div>

                <div class="admin-stat-card stat-info">
                    <div class="stat-icon">
                        <i data-lucide="check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <p class="stat-label">Pesanan Selesai</p>
                        <h3 class="stat-value">${completedOrders}</h3>
                        <p class="stat-change positive">+${completedOrders} total</p>
                    </div>
                </div>
            </div>

            <!-- Overview Section -->
            <div class="admin-grid-2">
                <!-- Recent Orders -->
                <div class="admin-card">
                    <div class="admin-card-header">
                        <h3><i data-lucide="shopping-cart"></i> Pesanan Terbaru</h3>
                        <button onclick="showAdminSection('orders')" class="btn-text">Lihat Semua →</button>
                    </div>
                    <div class="admin-card-body">
                        ${recentOrders.length > 0 ? `
                            <div class="admin-table-responsive">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Nomor Order</th>
                                            <th>Pelanggan</th>
                                            <th>Layanan</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${recentOrders.map(order => `
                                            <tr>
                                                <td><strong>${order.order_number}</strong></td>
                                                <td>${order.customer_name || 'N/A'}</td>
                                                <td>${order.service_name}</td>
                                                <td>Rp ${formatCurrency(order.total_price)}</td>
                                                <td><span class="badge badge-${order.payment_status === 'paid' ? 'success' : 'warning'}">${order.payment_status === 'paid' ? 'Lunas' : 'Pending'}</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : '<p class="text-center text-muted">Belum ada pesanan</p>'}
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="admin-card">
                    <div class="admin-card-header">
                        <h3><i data-lucide="bar-chart"></i> Statistik Quick</h3>
                    </div>
                    <div class="admin-card-body">
                        <div class="quick-stats">
                            <div class="quick-stat-item">
                                <i data-lucide="package"></i>
                                <div>
                                    <p class="quick-stat-value">${services.length}</p>
                                    <p class="quick-stat-label">Total Layanan</p>
                                </div>
                            </div>
                            <div class="quick-stat-item">
                                <i data-lucide="users"></i>
                                <div>
                                    <p class="quick-stat-value">${customers.length}</p>
                                    <p class="quick-stat-label">Total Pelanggan</p>
                                </div>
                            </div>
                            <div class="quick-stat-item">
                                <i data-lucide="star"></i>
                                <div>
                                    <p class="quick-stat-value">${testimonials.length}</p>
                                    <p class="quick-stat-label">Total Testimoni</p>
                                </div>
                            </div>
                            <div class="quick-stat-item">
                                <i data-lucide="alert-circle"></i>
                                <div>
                                    <p class="quick-stat-value">${pendingTestimonials}</p>
                                    <p class="quick-stat-label">Pending Approve</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
        lucide.createIcons();
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        throw error;
    }
}

// ============================================
// SERVICES MANAGEMENT SECTION
// ============================================
async function renderServicesManagement() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/services?all=true`, {
            headers: { 'Authorization': `Bearer ${AppState.user.token}` }
        });
        const data = await response.json();
        const services = data.data || [];

        const html = `
            <div class="admin-header">
                <div>
                    <h1>Kelola Layanan</h1>
                    <p>Manajemen produk dan jasa pertanian</p>
                </div>
                <div class="admin-header-actions">
                    <button onclick="showServiceModal()" class="btn-primary">
                        <i data-lucide="plus"></i>
                        Tambah Layanan
                    </button>
                </div>
            </div>

            <div class="admin-card">
                <div class="admin-table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nama Layanan</th>
                                <th>Kategori</th>
                                <th>Harga</th>
                                <th>Unit</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${services.map(service => `
                                <tr>
                                    <td>${service.id}</td>
                                    <td><strong>${service.name}</strong></td>
                                    <td><span class="badge badge-info">${service.category}</span></td>
                                    <td>Rp ${formatCurrency(service.price)}</td>
                                    <td>${service.unit}</td>
                                    <td><span class="badge badge-${service.is_active ? 'success' : 'secondary'}">${service.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button onclick="editService(${service.id})" class="btn-icon" title="Edit">
                                                <i data-lucide="edit"></i>
                                            </button>
                                            <button onclick="deleteService(${service.id}, '${service.name}')" class="btn-icon btn-danger" title="Hapus">
                                                <i data-lucide="trash-2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
        lucide.createIcons();
    } catch (error) {
        console.error('Error rendering services:', error);
        throw error;
    }
}

// Show Service Modal (Add/Edit)
async function showServiceModal(serviceId = null) {
    let service = null;
    let title = 'Tambah Layanan Baru';
    
    if (serviceId) {
        title = 'Edit Layanan';
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/services?id=${serviceId}`);
        const data = await response.json();
        service = data.data;
    }

    const modalHTML = `
        <div class="modal-overlay" id="serviceModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button onclick="closeModal('serviceModal')" class="modal-close">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <form id="serviceForm" onsubmit="submitService(event, ${serviceId})">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Nama Layanan *</label>
                            <input type="text" name="name" class="form-control" value="${service?.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Kategori *</label>
                            <select name="category" class="form-control" required>
                                <option value="jasa" ${service?.category === 'jasa' ? 'selected' : ''}>Pesan Jasa</option>
                                <option value="alsintan" ${service?.category === 'alsintan' ? 'selected' : ''}>Sewa Alsintan</option>
                                <option value="konsultasi" ${service?.category === 'konsultasi' ? 'selected' : ''}>Konsultasi</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Harga *</label>
                                <input type="number" name="price" class="form-control" value="${service?.price || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Unit *</label>
                                <input type="text" name="unit" class="form-control" value="${service?.unit || 'Ha'}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Deskripsi</label>
                            <textarea name="description" class="form-control" rows="3">${service?.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Fitur (JSON array) - Opsional</label>
                            <textarea name="features" class="form-control" rows="3" placeholder='["Fitur 1", "Fitur 2", "Fitur 3"]'>${service?.features ? JSON.stringify(service.features) : '[]'}</textarea>
                            <small class="form-text text-muted">Format: ["fitur1", "fitur2"] atau kosongkan untuk []</small>
                        </div>
                        <div class="form-group">
                            <label>Image URL</label>
                            <input type="text" name="image_url" class="form-control" value="${service?.image_url || ''}">
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="is_active" ${service?.is_active !== false ? 'checked' : ''}>
                                <span>Aktif</span>
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onclick="closeModal('serviceModal')" class="btn-secondary">Batal</button>
                        <button type="submit" class="btn-primary">
                            <i data-lucide="save"></i>
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
}

// Submit Service Form
async function submitService(event, serviceId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate and parse features JSON
    let features = [];
    const featuresInput = formData.get('features') || '[]';
    try {
        const trimmedFeatures = featuresInput.trim();
        if (trimmedFeatures === '' || trimmedFeatures === 'null' || trimmedFeatures === 'undefined') {
            features = [];
        } else {
            features = JSON.parse(trimmedFeatures);
            // Ensure it's an array
            if (!Array.isArray(features)) {
                throw new Error('Features harus berupa array');
            }
        }
    } catch (error) {
        showAlert('error', 'Format JSON features tidak valid. Gunakan format: ["fitur1", "fitur2"] atau kosongkan untuk []');
        return;
    }
    
    const data = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description') || '',
        price: parseFloat(formData.get('price')),
        unit: formData.get('unit'),
        features: features,
        image_url: formData.get('image_url') || '',
        is_active: formData.get('is_active') === 'on'
    };

    try {
        const url = serviceId 
            ? `${API_CONFIG.BASE_URL}/api/services?id=${serviceId}`
            : `${API_CONFIG.BASE_URL}/api/services`;
        
        const method = serviceId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.user.token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', result.message);
            closeModal('serviceModal');
            showAdminSection('services');
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        console.error('Error submitting service:', error);
        showAlert('error', 'Gagal menyimpan layanan: ' + error.message);
    }
}

// Edit Service
async function editService(serviceId) {
    await showServiceModal(serviceId);
}

// Delete Service
async function deleteService(serviceId, serviceName) {
    if (!confirm(`Apakah Anda yakin ingin menghapus layanan "${serviceName}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/services?id=${serviceId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${AppState.user.token}` }
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', 'Layanan berhasil dihapus');
            showAdminSection('services');
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        showAlert('error', 'Gagal menghapus layanan');
    }
}

// ============================================
// ORDERS MANAGEMENT SECTION
// ============================================
async function renderOrdersManagement() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
            headers: { 'Authorization': `Bearer ${AppState.user.token}` }
        });
        const data = await response.json();
        const orders = data.data || [];

        const html = `
            <div class="admin-header">
                <div>
                    <h1>Kelola Pesanan</h1>
                    <p>Manajemen semua pesanan pelanggan</p>
                </div>
            </div>

            <div class="admin-card">
                <div class="admin-table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Nomor Order</th>
                                <th>Pelanggan</th>
                                <th>Kontak</th>
                                <th>Layanan</th>
                                <th>Total</th>
                                <th>Pembayaran</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(order => `
                                <tr>
                                    <td><strong>${order.order_number}</strong></td>
                                    <td>${order.customer_name || 'N/A'}</td>
                                    <td>
                                        ${order.customer_phone ? `📞 ${order.customer_phone}<br>` : ''}
                                        ${order.customer_email || ''}
                                    </td>
                                    <td>${order.service_name}<br><small>${order.quantity} ${order.unit}</small></td>
                                    <td>Rp ${formatCurrency(order.total_price)}</td>
                                    <td><span class="badge badge-${order.payment_status === 'paid' ? 'success' : 'warning'}">${order.payment_status === 'paid' ? 'Lunas' : 'Pending'}</span></td>
                                    <td><span class="badge badge-info">${getStatusText(order.status)}</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button onclick="viewOrderDetails('${order.order_number}')" class="btn-icon" title="Detail">
                                                <i data-lucide="eye"></i>
                                            </button>
                                            <button onclick="showUpdateStatusModal(${order.id}, '${order.order_number}', '${order.service_name}', '${order.customer_name || 'N/A'}', '${order.payment_status}', '${order.status}')" class="btn-icon" title="Update Status">
                                                <i data-lucide="edit"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
        lucide.createIcons();
    } catch (error) {
        console.error('Error rendering orders:', error);
        throw error;
    }
}

// Get Status Text
function getStatusText(status) {
    const statusMap = {
        'pending': 'Menunggu',
        'scheduled': 'Terjadwal',
        'in_progress': 'Dalam Proses',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

// View Order Details
async function viewOrderDetails(orderNumber) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
            headers: { 'Authorization': `Bearer ${AppState.user.token}` }
        });
        const data = await response.json();
        const order = data.data.find(o => o.order_number === orderNumber);

        if (!order) {
            showAlert('error', 'Order tidak ditemukan');
            return;
        }

        const modalHTML = `
            <div class="modal-overlay" id="orderDetailModal">
                <div class="modal-container modal-large">
                    <div class="modal-header">
                        <h2>Detail Pesanan ${orderNumber}</h2>
                        <button onclick="closeModal('orderDetailModal')" class="modal-close">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Nomor Order</label>
                                <p><strong>${order.order_number}</strong></p>
                            </div>
                            <div class="detail-item">
                                <label>Tanggal Pemesanan</label>
                                <p>${formatDate(order.created_at)}</p>
                            </div>
                            <div class="detail-item">
                                <label>Pelanggan</label>
                                <p>${order.customer_name || 'N/A'}</p>
                            </div>
                            <div class="detail-item">
                                <label>Kontak</label>
                                <p>${order.customer_phone || '-'}<br>${order.customer_email || '-'}</p>
                            </div>
                            <div class="detail-item">
                                <label>Layanan</label>
                                <p>${order.service_name}</p>
                            </div>
                            <div class="detail-item">
                                <label>Kuantitas</label>
                                <p>${order.quantity} ${order.unit}</p>
                            </div>
                            <div class="detail-item">
                                <label>Total Harga</label>
                                <p><strong>Rp ${formatCurrency(order.total_price)}</strong></p>
                            </div>
                            <div class="detail-item">
                                <label>Status Pembayaran</label>
                                <p><span class="badge badge-${order.payment_status === 'paid' ? 'success' : 'warning'}">${order.payment_status === 'paid' ? 'Lunas' : 'Pending'}</span></p>
                            </div>
                            <div class="detail-item">
                                <label>Status Pesanan</label>
                                <p><span class="badge badge-info">${getStatusText(order.status)}</span></p>
                            </div>
                            <div class="detail-item">
                                <label>Tanggal Pelaksanaan</label>
                                <p>${formatDate(order.schedule_date)}</p>
                            </div>
                            <div class="detail-item full-width">
                                <label>Lokasi</label>
                                <p>${order.location}</p>
                            </div>
                            ${order.notes ? `
                                <div class="detail-item full-width">
                                    <label>Catatan</label>
                                    <p>${order.notes}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button onclick="closeModal('orderDetailModal')" class="btn-secondary">Tutup</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        lucide.createIcons();
    } catch (error) {
        console.error('Error viewing order:', error);
        showAlert('error', 'Gagal memuat detail pesanan');
    }
}

// Show Update Status Modal (Modal dengan Dropdown)
async function showUpdateStatusModal(orderId, orderNumber, serviceName, customerName, paymentStatus, currentStatus) {
    const modalHTML = `
        <div class="modal-overlay" id="updateStatusModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Ubah Status Pesanan</h2>
                    <button onclick="closeModal('updateStatusModal')" class="modal-close">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <form id="updateStatusForm" onsubmit="submitUpdateOrderStatus(event, ${orderId})">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Nomor Order:</label>
                            <p><strong>${orderNumber}</strong></p>
                        </div>
                        <div class="form-group">
                            <label>Layanan:</label>
                            <p><strong>${serviceName}</strong></p>
                        </div>
                        <div class="form-group">
                            <label>Pelanggan:</label>
                            <p><strong>${customerName}</strong></p>
                        </div>
                        <div class="form-group">
                            <label>Status Pembayaran:</label>
                            <p>
                                <span class="badge badge-${paymentStatus === 'paid' ? 'success' : 'warning'}">
                                    ${paymentStatus === 'paid' ? 'Lunas' : 'Pending'}
                                </span>
                            </p>
                        </div>
                        <div class="form-group">
                            <label>Status Pesanan Saat Ini:</label>
                            <p><span class="badge badge-info">${getStatusText(currentStatus)}</span></p>
                        </div>
                        
                        <!-- Dropdown Select untuk Status Baru -->
                        <div class="form-group">
                            <label>Ubah Status Ke: *</label>
                            <select 
                                name="newStatus" 
                                id="newStatusSelect" 
                                class="form-control" 
                                required
                                ${paymentStatus !== 'paid' ? 'disabled' : ''}
                            >
                                <option value="">-- Pilih Status Baru --</option>
                                <option value="confirmed">📅 Terjadwal</option>
                                <option value="in_progress">⚙️ Sedang Berjalan</option>
                                <option value="completed">✅ Selesai</option>
                                <option value="cancelled">❌ Dibatalkan</option>
                            </select>
                            ${paymentStatus !== 'paid' ? `
                                <small class="form-text text-warning" style="color: #f59e0b; margin-top: 8px; display: block;">
                                    ⚠️ Pesanan hanya bisa diubah setelah pembayaran lunas
                                </small>
                            ` : ''}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onclick="closeModal('updateStatusModal')" class="btn-secondary">
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            class="btn-primary"
                            ${paymentStatus !== 'paid' ? 'disabled' : ''}
                        >
                            <i data-lucide="check"></i>
                            Konfirmasi Ubah Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
}

// Submit Update Order Status (Fungsi untuk submit form)
async function submitUpdateOrderStatus(event, orderId) {
    event.preventDefault();
    
    const form = event.target;
    const newStatus = form.newStatus.value;
    
    if (!newStatus) {
        showAlert('error', 'Pilih status baru terlebih dahulu');
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders?id=${orderId}&action=status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.user.token}`
            },
            body: JSON.stringify({ 
                status: newStatus,
                description: `Status diubah menjadi ${getStatusText(newStatus)} oleh admin`
            })
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', 'Status pesanan berhasil diperbarui');
            closeModal('updateStatusModal');
            showAdminSection('orders');
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        console.error('Error updating order:', error);
        showAlert('error', 'Gagal mengupdate status');
    }
}

// ============================================
// CUSTOMERS MANAGEMENT SECTION
// ============================================
async function renderCustomersManagement() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth?action=users`, {
            headers: { 'Authorization': `Bearer ${AppState.user.token}` }
        });
        const data = await response.json();
        const customers = data.data || [];

        const html = `
            <div class="admin-header">
                <div>
                    <h1>Kelola Pelanggan</h1>
                    <p>Manajemen data pelanggan dan riwayat</p>
                </div>
            </div>

            <div class="admin-card">
                <div class="admin-table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Telepon</th>
                                <th>Total Pesanan</th>
                                <th>Total Spent</th>
                                <th>Bergabung</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.map(customer => `
                                <tr>
                                    <td>${customer.id}</td>
                                    <td><strong>${customer.name}</strong></td>
                                    <td>${customer.email}</td>
                                    <td>${customer.phone || '-'}</td>
                                    <td>${customer.total_orders || 0}</td>
                                    <td>Rp ${formatCurrency(customer.total_spent || 0)}</td>
                                    <td>${formatDate(customer.created_at)}</td>
                                    <td>
                                        <button onclick="viewCustomerDetails(${customer.id})" class="btn-icon" title="Detail">
                                            <i data-lucide="eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
        lucide.createIcons();
    } catch (error) {
        console.error('Error rendering customers:', error);
        throw error;
    }
}

// View Customer Details
async function viewCustomerDetails(customerId) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth?action=user-detail&id=${customerId}`, {
            headers: { 'Authorization': `Bearer ${AppState.user.token}` }
        });
        const data = await response.json();
        const { user, orders } = data.data;

        const modalHTML = `
            <div class="modal-overlay" id="customerDetailModal">
                <div class="modal-container modal-large">
                    <div class="modal-header">
                        <h2>Detail Pelanggan</h2>
                        <button onclick="closeModal('customerDetailModal')" class="modal-close">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Nama</label>
                                <p><strong>${user.name}</strong></p>
                            </div>
                            <div class="detail-item">
                                <label>Email</label>
                                <p>${user.email}</p>
                            </div>
                            <div class="detail-item">
                                <label>Telepon</label>
                                <p>${user.phone || '-'}</p>
                            </div>
                            <div class="detail-item">
                                <label>Bergabung</label>
                                <p>${formatDate(user.created_at)}</p>
                            </div>
                        </div>

                        <h3 class="mt-4 mb-2">Riwayat Pesanan (${orders.length})</h3>
                        ${orders.length > 0 ? `
                            <div class="admin-table-responsive">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Nomor Order</th>
                                            <th>Layanan</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${orders.map(order => `
                                            <tr>
                                                <td>${order.order_number}</td>
                                                <td>${order.service_name}</td>
                                                <td>Rp ${formatCurrency(order.total_price)}</td>
                                                <td><span class="badge badge-${order.payment_status === 'paid' ? 'success' : 'warning'}">${order.payment_status}</span></td>
                                                <td>${formatDate(order.created_at)}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : '<p class="text-center text-muted">Belum ada pesanan</p>'}
                    </div>
                    <div class="modal-footer">
                        <button onclick="closeModal('customerDetailModal')" class="btn-secondary">Tutup</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        lucide.createIcons();
    } catch (error) {
        console.error('Error viewing customer:', error);
        showAlert('error', 'Gagal memuat detail pelanggan');
    }
}

// ============================================
// TESTIMONIALS MANAGEMENT SECTION
// ============================================
async function renderTestimonialsManagement() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/testimonials?action=all`, {
            headers: { 'Authorization': `Bearer ${AppState.user.token}` }
        });
        const data = await response.json();
        const testimonials = data.data || [];

        const html = `
            <div class="admin-header">
                <div>
                    <h1>Kelola Testimoni</h1>
                    <p>Manajemen dan moderasi testimoni pelanggan</p>
                </div>
            </div>

            <div class="admin-card">
                <div class="admin-table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Pelanggan</th>
                                <th>Layanan</th>
                                <th>Rating</th>
                                <th>Komentar</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${testimonials.map(testi => `
                                <tr>
                                    <td>${testi.id}</td>
                                    <td>${testi.user_name}<br><small>${testi.user_email}</small></td>
                                    <td>${testi.service_name || '-'}</td>
                                    <td>${'⭐'.repeat(testi.rating)}</td>
                                    <td><small>${testi.message ? testi.message.substring(0, 50) + '...' : '-'}</small></td>
                                    <td>
                                        <span class="badge badge-${testi.status === 'approved' ? 'success' : testi.status === 'pending' ? 'warning' : 'secondary'}">
                                            ${testi.status === 'approved' ? 'Disetujui' : testi.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                                        </span>
                                        ${testi.is_featured ? '<span class="badge badge-info">Featured</span>' : ''}
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            ${testi.status !== 'approved' ? `
                                                <button onclick="approveTestimonial(${testi.id}, 'approved')" class="btn-icon btn-success" title="Approve">
                                                    <i data-lucide="check"></i>
                                                </button>
                                            ` : ''}
                                            ${testi.status !== 'rejected' ? `
                                                <button onclick="approveTestimonial(${testi.id}, 'rejected')" class="btn-icon btn-danger" title="Reject">
                                                    <i data-lucide="x"></i>
                                                </button>
                                            ` : ''}
                                            <button onclick="toggleFeatured(${testi.id}, ${!testi.is_featured})" class="btn-icon" title="Toggle Featured">
                                                <i data-lucide="star"></i>
                                            </button>
                                            <button onclick="viewTestimonialDetail(${testi.id})" class="btn-icon" title="View Detail">
                                                <i data-lucide="eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
        lucide.createIcons();
    } catch (error) {
        console.error('Error rendering testimonials:', error);
        throw error;
    }
}

// Approve/Reject Testimonial
async function approveTestimonial(testiId, status) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/testimonials?id=${testiId}&action=approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.user.token}`
            },
            body: JSON.stringify({ status: status })
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', `Testimoni berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
            showAdminSection('testimonials');
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        console.error('Error updating testimonial:', error);
        showAlert('error', 'Gagal mengupdate testimoni');
    }
}

// Toggle Featured Testimonial
async function toggleFeatured(testiId, isFeatured) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/testimonials?id=${testiId}&action=approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.user.token}`
            },
            body: JSON.stringify({ is_featured: isFeatured, status: 'approved' })
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', `Testimoni berhasil ${isFeatured ? 'ditandai' : 'dihapus dari'} featured`);
            showAdminSection('testimonials');
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        console.error('Error updating featured:', error);
        showAlert('error', 'Gagal mengupdate featured');
    }
}

// View Testimonial Detail
async function viewTestimonialDetail(testiId) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/testimonials?id=${testiId}`, {
            headers: { 'Authorization': `Bearer ${AppState.user.token}` }
        });
        const data = await response.json();
        const testi = data.data;
        
        if (!testi) {
            showAlert('error', 'Testimoni tidak ditemukan');
            return;
        }
        
        const modalHTML = `
            <div class="modal-overlay" onclick="closeTestimonialDetailModal(event)">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>Detail Testimoni</h2>
                        <button onclick="closeTestimonialDetailModal()" class="modal-close">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-section">
                            <label>Pelanggan:</label>
                            <p><strong>${testi.user_name}</strong></p>
                            <p class="text-sm text-gray-600">${testi.user_email}</p>
                        </div>
                        
                        <div class="detail-section">
                            <label>Layanan:</label>
                            <p>${testi.service_name || '-'}</p>
                        </div>
                        
                        <div class="detail-section">
                            <label>Rating:</label>
                            <p>${'⭐'.repeat(testi.rating)} (${testi.rating}/5)</p>
                        </div>
                        
                        <div class="detail-section">
                            <label>Testimoni:</label>
                            <p class="testimonial-message">${testi.message || '-'}</p>
                        </div>
                        
                        <div class="detail-section">
                            <label>Status:</label>
                            <span class="badge badge-${testi.status === 'approved' ? 'success' : testi.status === 'pending' ? 'warning' : 'secondary'}">
                                ${testi.status === 'approved' ? 'Disetujui' : testi.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                            </span>
                            ${testi.is_featured ? '<span class="badge badge-info ml-2">Featured</span>' : ''}
                        </div>
                        
                        <div class="detail-section">
                            <label>Tanggal:</label>
                            <p>${formatDateTime(testi.created_at)}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        ${testi.status !== 'approved' ? `
                            <button onclick="approveTestimonial(${testiId}, 'approved'); closeTestimonialDetailModal();" class="btn-primary">
                                <i data-lucide="check"></i> Setujui
                            </button>
                        ` : ''}
                        ${testi.status !== 'rejected' ? `
                            <button onclick="approveTestimonial(${testiId}, 'rejected'); closeTestimonialDetailModal();" class="btn-danger">
                                <i data-lucide="x"></i> Tolak
                            </button>
                        ` : ''}
                        <button onclick="toggleFeatured(${testiId}, ${!testi.is_featured}); closeTestimonialDetailModal();" class="btn-secondary">
                            <i data-lucide="star"></i> ${testi.is_featured ? 'Hapus dari Featured' : 'Jadikan Featured'}
                        </button>
                        <button onclick="closeTestimonialDetailModal()" class="btn-outline">Tutup</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        lucide.createIcons();
    } catch (error) {
        console.error('Error viewing testimonial detail:', error);
        showAlert('error', 'Gagal memuat detail testimoni');
    }
}

function closeTestimonialDetailModal(event) {
    if (event && event.target.className !== 'modal-overlay') return;
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

// ============================================
// ANALYTICS SECTION
// ============================================
async function renderAnalytics() {
    const html = `
        <div class="admin-header">
            <h1>Analitik & Laporan</h1>
            <p>Data penjualan, pendapatan, dan tren</p>
        </div>

        <div class="admin-card">
            <div class="text-center" style="padding: 60px 20px;">
                <i data-lucide="bar-chart-3" style="width: 64px; height: 64px; color: #ccc;"></i>
                <h3 style="margin-top: 20px; color: #666;">Fitur Analitik</h3>
                <p style="color: #999;">Grafik dan laporan analytics akan tersedia segera.</p>
                <p style="color: #999;">Integrasi dengan Chart.js untuk visualisasi data.</p>
            </div>
        </div>
    `;

    document.getElementById('admin-content').innerHTML = html;
    lucide.createIcons();
}

// ============================================
// SETTINGS SECTION
// ============================================
async function renderSettings() {
    const html = `
        <div class="admin-header">
            <h1>Pengaturan</h1>
            <p>Konfigurasi sistem dan keamanan</p>
        </div>

        <div class="admin-card">
            <div class="text-center" style="padding: 60px 20px;">
                <i data-lucide="settings" style="width: 64px; height: 64px; color: #ccc;"></i>
                <h3 style="margin-top: 20px; color: #666;">Pengaturan Sistem</h3>
                <p style="color: #999;">Halaman pengaturan sedang dalam pengembangan.</p>
                <p style="color: #999;">Akan tersedia: Konfigurasi email, pembayaran, notifikasi, dll.</p>
            </div>
        </div>
    `;

    document.getElementById('admin-content').innerHTML = html;
    lucide.createIcons();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Export functions
window.renderAdminPanel = renderAdminPanel;
window.showAdminSection = showAdminSection;
window.showServiceModal = showServiceModal;
window.submitService = submitService;
window.editService = editService;
window.deleteService = deleteService;
window.viewOrderDetails = viewOrderDetails;
window.showUpdateStatusModal = showUpdateStatusModal;
window.submitUpdateOrderStatus = submitUpdateOrderStatus;
window.viewCustomerDetails = viewCustomerDetails;
window.approveTestimonial = approveTestimonial;
window.toggleFeatured = toggleFeatured;
window.viewTestimonialDetail = viewTestimonialDetail;
window.closeTestimonialDetailModal = closeTestimonialDetailModal;
window.closeModal = closeModal;
window.getStatusText = getStatusText;
