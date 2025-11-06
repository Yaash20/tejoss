// Tejoss Platform - API Client

class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    // Get auth token from localStorage
    getAuthToken() {
        const user = localStorage.getItem('tejoss_user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                return userData.token;
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    // Build headers
    buildHeaders(includeAuth = true, isFormData = false) {
        const headers = {};
        
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        if (includeAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }

    // Make HTTP request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: this.buildHeaders(options.auth !== false, options.isFormData),
            ...options
        };

        // Add body if provided
        if (options.body && !options.isFormData) {
            config.body = JSON.stringify(options.body);
        } else if (options.body && options.isFormData) {
            config.body = options.body;
        }

        try {
            const response = await fetch(url, config);
            
            // Try to parse JSON response
            let data;
            try {
                const text = await response.text();
                data = text ? JSON.parse(text) : {};
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Server mengembalikan response yang tidak valid');
            }

            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401) {
                    // Clear user data
                    localStorage.removeItem('tejoss_user');
                    AppState.user = null;
                    updateAuthUI();
                    
                    // Show alert and redirect to login
                    showAlert('warning', 'Sesi Anda telah berakhir. Silakan login kembali.');
                    
                    // Delay redirect to allow user to see the alert
                    setTimeout(() => {
                        navigateTo('login');
                    }, 1500);
                    
                    throw new Error('Sesi Anda telah berakhir, silakan login kembali');
                }
                
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                throw new Error(APP_CONFIG.MESSAGES.NETWORK_ERROR);
            }
            throw error;
        }
    }

    // Helper methods for different HTTP methods
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }

    async put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    // ==================== AUTH APIs ====================
    
    async register(userData) {
        return this.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData, { auth: false });
    }

    async login(credentials) {
        return this.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials, { auth: false });
    }

    async getMe() {
        return this.get(API_CONFIG.ENDPOINTS.AUTH.ME);
    }

    async getProfile() {
        return this.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    }

    async updateProfile(userData) {
        return this.put(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, userData);
    }

    async changePassword(passwordData) {
        return this.put(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    }

    async forgotPassword(email) {
        return this.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, { auth: false });
    }

    async resetPassword(token, newPassword) {
        return this.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword }, { auth: false });
    }

    // ==================== SERVICES APIs ====================
    
    async getServices(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.SERVICES.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.SERVICES.LIST;
        return this.get(endpoint, { auth: false });
    }

    async getServiceDetail(id) {
        const endpoint = API_CONFIG.ENDPOINTS.SERVICES.DETAIL.replace(':id', id);
        return this.get(endpoint, { auth: false });
    }

    async getServiceCategories() {
        return this.get(API_CONFIG.ENDPOINTS.SERVICES.CATEGORIES, { auth: false });
    }

    // ==================== ORDERS APIs ====================
    
    async createOrder(orderData) {
        return this.post(API_CONFIG.ENDPOINTS.ORDERS.CREATE, orderData);
    }

    async getOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.ORDERS.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.ORDERS.LIST;
        return this.get(endpoint);
    }

    async getOrderDetail(id) {
        const endpoint = API_CONFIG.ENDPOINTS.ORDERS.DETAIL.replace(':id', id);
        return this.get(endpoint);
    }

    async updateOrderStatus(id, status, notes = '') {
        const endpoint = API_CONFIG.ENDPOINTS.ORDERS.UPDATE_STATUS.replace(':id', id);
        return this.put(endpoint, { status, notes });
    }

    async cancelOrder(id, reason) {
        const endpoint = API_CONFIG.ENDPOINTS.ORDERS.CANCEL.replace(':id', id);
        return this.put(endpoint, { reason });
    }

    async getOrderStats() {
        return this.get(API_CONFIG.ENDPOINTS.ORDERS.STATS);
    }

    // ==================== PAYMENTS APIs ====================
    
    async createPayment(paymentData) {
        return this.post(API_CONFIG.ENDPOINTS.PAYMENTS.CREATE, paymentData);
    }

    async verifyPayment(orderId, paymentProof) {
        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('payment_proof', paymentProof);
        
        return this.post(API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY, formData, { isFormData: true });
    }

    async getPaymentDetail(id) {
        const endpoint = API_CONFIG.ENDPOINTS.PAYMENTS.DETAIL.replace(':id', id);
        return this.get(endpoint);
    }

    // ==================== TESTIMONIALS APIs ====================
    
    async getTestimonials(params = {}) {
        // If userId is provided, fetch user's testimonials
        if (params.userId) {
            return this.get(`${API_CONFIG.ENDPOINTS.TESTIMONIALS.LIST}?action=my`);
        }
        
        // Otherwise, fetch public testimonials
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.TESTIMONIALS.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.TESTIMONIALS.LIST;
        return this.get(endpoint, { auth: false });
    }

    async createTestimonial(testimonialData) {
        return this.post(API_CONFIG.ENDPOINTS.TESTIMONIALS.CREATE, testimonialData);
    }

    async getTestimonialDetail(id) {
        const endpoint = API_CONFIG.ENDPOINTS.TESTIMONIALS.DETAIL.replace(':id', id);
        return this.get(endpoint, { auth: false });
    }

    // ==================== ARTICLES APIs ====================
    
    async getArticles(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.ARTICLES.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.ARTICLES.LIST;
        return this.get(endpoint, { auth: false });
    }

    async getArticleDetail(id) {
        const endpoint = API_CONFIG.ENDPOINTS.ARTICLES.DETAIL.replace(':id', id);
        return this.get(endpoint, { auth: false });
    }

    async getArticleCategories() {
        return this.get(API_CONFIG.ENDPOINTS.ARTICLES.CATEGORIES, { auth: false });
    }

    // ==================== B2B APIs ====================
    
    async createB2BRequest(requestData) {
        return this.post(API_CONFIG.ENDPOINTS.B2B.CREATE, requestData, { auth: false });
    }

    async getB2BRequests(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.B2B.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.B2B.LIST;
        return this.get(endpoint);
    }

    async getB2BRequestDetail(id) {
        const endpoint = API_CONFIG.ENDPOINTS.B2B.DETAIL.replace(':id', id);
        return this.get(endpoint);
    }

    async updateB2BStatus(id, status, notes = '') {
        const endpoint = API_CONFIG.ENDPOINTS.B2B.UPDATE_STATUS.replace(':id', id);
        return this.put(endpoint, { status, notes });
    }

    // ==================== NOTIFICATIONS APIs ====================
    
    async getNotifications(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST;
        return this.get(endpoint);
    }

    async getUnreadCount() {
        return this.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    }

    async markNotificationRead(id) {
        const endpoint = API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ.replace(':id', id);
        return this.put(endpoint, {});
    }

    async markAllNotificationsRead() {
        return this.put(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {});
    }
}

// Create global API instance
const API = new APIClient();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIClient, API };
}