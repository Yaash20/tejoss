// Tejoss Platform - Configuration

// ============================================================
// IMPORTANT: SETELAH DEPLOY KE VERCEL
// ============================================================
// Ganti BASE_URL dan API_URL dengan Vercel deployment URL:
// Contoh: 'https://tejoss-platform-xxx.vercel.app'
// 
// Untuk localhost development, tetap gunakan http://localhost:5000
// ============================================================

// API Configuration
const API_CONFIG = {
    // Base URL untuk backend API
    // Ubah ini sesuai dengan URL backend Anda
    BASE_URL: 'http://localhost:5000',
    API_URL: 'http://localhost:5000/api',
    
    // Timeout untuk requests (milliseconds)
    TIMEOUT: 30000,
    
    // Endpoints
    ENDPOINTS: {
        // Auth
        AUTH: {
            REGISTER: '/auth/register',
            LOGIN: '/auth/login',
            ME: '/auth/me',
            PROFILE: '/auth/profile',
            UPDATE_PROFILE: '/auth/profile',
            CHANGE_PASSWORD: '/auth/change-password',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password'
        },
        
        // Services
        SERVICES: {
            LIST: '/services',
            DETAIL: '/services/:id',
            CATEGORIES: '/services/categories'
        },
        
        // Orders
        ORDERS: {
            CREATE: '/orders',
            LIST: '/orders',
            DETAIL: '/orders/:id',
            UPDATE_STATUS: '/orders/:id/status',
            CANCEL: '/orders/:id/cancel',
            STATS: '/orders/stats'
        },
        
        // Payments
        PAYMENTS: {
            CREATE: '/payments',
            VERIFY: '/payments/verify',
            DETAIL: '/payments/:id',
            CALLBACK: '/payments/callback'
        },
        
        // Testimonials
        TESTIMONIALS: {
            LIST: '/testimonials',
            CREATE: '/testimonials',
            DETAIL: '/testimonials/:id'
        },
        
        // Articles
        ARTICLES: {
            LIST: '/articles',
            DETAIL: '/articles/:id',
            CATEGORIES: '/articles/categories'
        },
        
        // B2B
        B2B: {
            CREATE: '/b2b',
            LIST: '/b2b',
            DETAIL: '/b2b/:id',
            UPDATE_STATUS: '/b2b/:id/status'
        },
        
        // Notifications
        NOTIFICATIONS: {
            LIST: '/notifications',
            UNREAD_COUNT: '/notifications/unread-count',
            MARK_READ: '/notifications/:id/read',
            MARK_ALL_READ: '/notifications/read-all'
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
