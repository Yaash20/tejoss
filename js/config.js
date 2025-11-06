// Tejoss Platform - Configuration

// ============================================================
// AUTO-DETECT ENVIRONMENT (localhost vs production)
// ============================================================
// Tidak perlu ubah manual lagi!
// - localhost: pakai http://localhost:5000
// - production: pakai same origin (Vercel)
// ============================================================

// Detect environment
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

// API Configuration
const API_CONFIG = {
    // Base URL untuk backend API (auto-detect)
    BASE_URL: isLocalhost ? 'http://localhost:5000' : '',
    
    // Timeout untuk requests (milliseconds)
    TIMEOUT: 30000,
    
    // Endpoints (semua sudah pakai prefix /api/)
    ENDPOINTS: {
        // Auth - Now using query parameters
        AUTH: {
            REGISTER: '/api/auth?action=register',
            LOGIN: '/api/auth?action=login',
            ME: '/api/auth?action=me',
            PROFILE: '/api/auth?action=profile',
            UPDATE_PROFILE: '/api/auth?action=profile',
            CHANGE_PASSWORD: '/api/auth?action=change-password',
            FORGOT_PASSWORD: '/api/auth?action=forgot-password',
            RESET_PASSWORD: '/api/auth?action=reset-password'
        },
        
        // Services
        SERVICES: {
            LIST: '/api/services',
            DETAIL: '/api/services?id=:id',
            CATEGORIES: '/api/services/categories'
        },
        
        // Orders
        ORDERS: {
            CREATE: '/api/orders',
            LIST: '/api/orders',
            DETAIL: '/api/orders?id=:id',
            UPDATE_STATUS: '/api/orders?id=:id&action=status',
            CANCEL: '/api/orders?id=:id&action=cancel',
            STATS: '/api/orders?action=stats'
        },
        
        // Payments
        PAYMENTS: {
            CREATE: '/api/payments?action=create',
            VERIFY: '/api/payments/verify',
            DETAIL: '/api/payments?id=:id',
            CALLBACK: '/api/payments/callback'
        },
        
        // Testimonials
        TESTIMONIALS: {
            LIST: '/api/testimonials',
            CREATE: '/api/testimonials',
            DETAIL: '/api/testimonials?id=:id'
        },
        
        // Articles
        ARTICLES: {
            LIST: '/api/articles',
            DETAIL: '/api/articles?id=:id',
            CATEGORIES: '/api/articles/categories'
        },
        
        // B2B
        B2B: {
            CREATE: '/api/b2b',
            LIST: '/api/b2b',
            DETAIL: '/api/b2b?id=:id',
            UPDATE_STATUS: '/api/b2b?id=:id&action=status'
        },
        
        // Notifications
        NOTIFICATIONS: {
            LIST: '/api/notifications',
            UNREAD_COUNT: '/api/notifications/unread-count',
            MARK_READ: '/api/notifications?id=:id&action=read',
            MARK_ALL_READ: '/api/notifications/read-all'
        }
    }
};

// App Configuration
const APP_CONFIG = {
    APP_NAME: 'Tejoss',
    VERSION: '1.0.0',
    
    // Pagination
    ITEMS_PER_PAGE: 10,
    
    // Upload limits
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    
    // Validation
    MIN_PASSWORD_LENGTH: 8,
    
    // Messages
    MESSAGES: {
        NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
        SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
        SUCCESS_SAVE: 'Data berhasil disimpan',
        SUCCESS_UPDATE: 'Data berhasil diperbarui',
        SUCCESS_DELETE: 'Data berhasil dihapus'
    }
};

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, APP_CONFIG };
}
