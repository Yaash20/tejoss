// Tejoss Platform - API Integration Functions
// File ini berisi fungsi-fungsi yang mengintegrasikan UI dengan backend API

// ==================== SERVICES ====================

async function loadServices(filters = {}) {
    try {
        const response = await API.getServices(filters);
        if (response.success) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error loading services:', error);
        showAlert('error', 'Gagal memuat layanan. ' + error.message);
        return [];
    }
}

async function loadServiceDetail(serviceId) {
    try {
        const response = await API.getServiceDetail(serviceId);
        if (response.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Error loading service detail:', error);
        showAlert('error', 'Gagal memuat detail layanan.');
        return null;
    }
}

// ==================== ORDERS ====================

async function createOrder(orderData) {
    try {
        // Check if user is logged in
        if (!AppState.user) {
            showAlert('warning', 'Silakan login terlebih dahulu untuk melakukan pemesanan.');
            navigateTo('login');
            return null;
        }
        
        const response = await API.createOrder(orderData);
        if (response.success) {
            showAlert('success', 'Pesanan berhasil dibuat!');
            return response.data;
        }
        showAlert('error', response.message || 'Gagal membuat pesanan.');
        return null;
    } catch (error) {
        console.error('Error creating order:', error);
        showAlert('error', error.message || 'Gagal membuat pesanan.');
        return null;
    }
}

async function loadOrders(filters = {}) {
    try {
        if (!AppState.user) {
            return [];
        }
        
        const response = await API.getOrders(filters);
        if (response.success) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error loading orders:', error);
        showAlert('error', 'Gagal memuat pesanan.');
        return [];
    }
}

async function loadOrderDetail(orderId) {
    try {
        const response = await API.getOrderDetail(orderId);
        if (response.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Error loading order detail:', error);
        showAlert('error', 'Gagal memuat detail pesanan.');
        return null;
    }
}

async function loadOrderStats() {
    try {
        if (!AppState.user) {
            return null;
        }
        
        const response = await API.getOrderStats();
        if (response.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Error loading order stats:', error);
        return null;
    }
}

async function cancelOrder(orderId, reason) {
    try {
        const response = await API.cancelOrder(orderId, reason);
        if (response.success) {
            showAlert('success', 'Pesanan berhasil dibatalkan.');
            return true;
        }
        showAlert('error', response.message || 'Gagal membatalkan pesanan.');
        return false;
    } catch (error) {
        console.error('Error canceling order:', error);
        showAlert('error', error.message || 'Gagal membatalkan pesanan.');
        return false;
    }
}

// ==================== PAYMENTS ====================

async function createPayment(paymentData) {
    try {
        const response = await API.createPayment(paymentData);
        if (response.success) {
            return response.data;
        }
        showAlert('error', response.message || 'Gagal membuat pembayaran.');
        return null;
    } catch (error) {
        console.error('Error creating payment:', error);
        showAlert('error', error.message || 'Gagal membuat pembayaran.');
        return null;
    }
}

async function verifyPayment(orderId, paymentProofFile) {
    try {
        const response = await API.verifyPayment(orderId, paymentProofFile);
        if (response.success) {
            showAlert('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi.');
            return true;
        }
        showAlert('error', response.message || 'Gagal mengunggah bukti pembayaran.');
        return false;
    } catch (error) {
        console.error('Error verifying payment:', error);
        showAlert('error', error.message || 'Gagal mengunggah bukti pembayaran.');
        return false;
    }
}

// ==================== TESTIMONIALS ====================

async function loadTestimonials(filters = {}) {
    try {
        const response = await API.getTestimonials(filters);
        if (response.success) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error loading testimonials:', error);
        return [];
    }
}

async function createTestimonial(testimonialData) {
    try {
        // Check if user is logged in
        if (!AppState.user) {
            showAlert('warning', 'Silakan login terlebih dahulu untuk memberikan testimoni.');
            navigateTo('login');
            return false;
        }
        
        // Check if token exists
        const userData = localStorage.getItem('tejoss_user');
        if (!userData) {
            showAlert('warning', 'Sesi Anda telah berakhir. Silakan login kembali.');
            AppState.user = null;
            updateAuthUI();
            navigateTo('login');
            return false;
        }
        
        // Validate testimonial data
        if (!testimonialData.rating || testimonialData.rating < 1 || testimonialData.rating > 5) {
            showAlert('error', 'Rating harus antara 1-5');
            return false;
        }
        
        if (!testimonialData.message || testimonialData.message.trim().length < 10) {
            showAlert('error', 'Testimoni minimal 10 karakter');
            return false;
        }
        
        const response = await API.createTestimonial(testimonialData);
        if (response.success) {
            showAlert('success', 'Terima kasih atas testimoni Anda! Testimoni akan ditampilkan setelah disetujui admin.');
            return true;
        }
        showAlert('error', response.message || 'Gagal mengirim testimoni.');
        return false;
    } catch (error) {
        console.error('Error creating testimonial:', error);
        
        // Check if it's an auth error
        if (error.message && error.message.includes('berakhir')) {
            // Already handled in API.js - don't show duplicate alert
            return false;
        }
        
        showAlert('error', error.message || 'Gagal mengirim testimoni.');
        return false;
    }
}

// ==================== ARTICLES / EDUKASI ====================

async function loadArticles(filters = {}) {
    try {
        const response = await API.getArticles(filters);
        if (response.success) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error loading articles:', error);
        return [];
    }
}

async function loadArticleDetail(articleId) {
    try {
        const response = await API.getArticleDetail(articleId);
        if (response.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Error loading article detail:', error);
        return null;
    }
}

// ==================== B2B ====================

async function createB2BRequest(requestData) {
    try {
        const response = await API.createB2BRequest(requestData);
        if (response.success) {
            showAlert('success', 'Permintaan kerjasama B2B berhasil dikirim! Tim kami akan segera menghubungi Anda.');
            return true;
        }
        showAlert('error', response.message || 'Gagal mengirim permintaan B2B.');
        return false;
    } catch (error) {
        console.error('Error creating B2B request:', error);
        showAlert('error', error.message || 'Gagal mengirim permintaan B2B.');
        return false;
    }
}

// ==================== NOTIFICATIONS ====================

async function loadNotifications() {
    try {
        if (!AppState.user) {
            return [];
        }
        
        const response = await API.getNotifications();
        if (response.success) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error loading notifications:', error);
        return [];
    }
}

async function loadUnreadNotificationCount() {
    try {
        if (!AppState.user) {
            return 0;
        }
        
        const response = await API.getUnreadCount();
        if (response.success) {
            return response.data.count;
        }
        return 0;
    } catch (error) {
        console.error('Error loading unread count:', error);
        return 0;
    }
}

async function markNotificationAsRead(notificationId) {
    try {
        await API.markNotificationRead(notificationId);
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// ==================== PROFILE ====================

async function updateUserProfile(profileData) {
    try {
        const response = await API.updateProfile(profileData);
        if (response.success) {
            // Update local user data
            AppState.user = { ...AppState.user, ...response.data };
            localStorage.setItem('tejoss_user', JSON.stringify(AppState.user));
            updateAuthUI();
            showAlert('success', 'Profil berhasil diperbarui.');
            return true;
        }
        showAlert('error', response.message || 'Gagal memperbarui profil.');
        return false;
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('error', error.message || 'Gagal memperbarui profil.');
        return false;
    }
}

async function changeUserPassword(passwordData) {
    try {
        const response = await API.changePassword(passwordData);
        if (response.success) {
            showAlert('success', 'Password berhasil diubah.');
            return true;
        }
        showAlert('error', response.message || 'Gagal mengubah password.');
        return false;
    } catch (error) {
        console.error('Error changing password:', error);
        showAlert('error', error.message || 'Gagal mengubah password.');
        return false;
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Initialize data when page loads (if needed)
async function initializePageData(section) {
    switch(section) {
        case 'services':
            // Load services data if needed
            break;
        case 'testimonials':
            // Load testimonials if needed
            break;
        case 'my-orders':
            // Load orders if needed
            if (AppState.user) {
                await loadOrders();
            }
            break;
        // Add more cases as needed
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadServices,
        loadServiceDetail,
        createOrder,
        loadOrders,
        loadOrderDetail,
        loadOrderStats,
        cancelOrder,
        createPayment,
        verifyPayment,
        loadTestimonials,
        createTestimonial,
        loadArticles,
        loadArticleDetail,
        createB2BRequest,
        loadNotifications,
        loadUnreadNotificationCount,
        markNotificationAsRead,
        updateUserProfile,
        changeUserPassword,
        initializePageData
    };
}
