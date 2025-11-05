// Tejoss Platform - Main Application JavaScript

// Global State
const AppState = {
    currentSection: 'home',
    user: null,
    selectedService: null,
    selectedPackage: null,
    chatMessages: [],
    isChatOpen: false
};

// Initialize App
function initializeApp() {
    // Check for stored user
    const storedUser = localStorage.getItem('tejoss_user');
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            
            // Validate that token exists
            if (userData.token) {
                AppState.user = userData;
                updateAuthUI();
            } else {
                // No token, clear stored data
                console.warn('No token found in stored user data');
                localStorage.removeItem('tejoss_user');
                AppState.user = null;
            }
        } catch (error) {
            console.error('Error parsing stored user data:', error);
            localStorage.removeItem('tejoss_user');
            AppState.user = null;
        }
    }

    // Check URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
        navigateTo(hash);
    } else {
        navigateTo('home');
    }

    // Initialize chat
    initializeChat();

    // Handle browser back/forward
    window.addEventListener('popstate', function() {
        const section = window.location.hash.slice(1) || 'home';
        navigateTo(section, false);
    });
}

// Navigation
function navigateTo(section, updateHistory = true) {
    AppState.currentSection = section;
    
    // Update URL
    if (updateHistory) {
        const url = section === 'home' ? '/' : `/#${section}`;
        window.history.pushState(null, '', url);
    }

    // Update active nav links
    updateActiveNavLinks(section);

    // Render content
    renderContent(section);

    // Close mobile menu
    closeMobileMenu();

    // Scroll to top
    window.scrollTo(0, 0);

    // Re-initialize icons
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

// Update Active Navigation Links
function updateActiveNavLinks(section) {
    // Desktop nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });

    // Mobile nav
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.add('hidden');
}

// Toggle User Dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('user-menu');
    const dropdown = document.getElementById('user-dropdown');
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

// Update Auth UI
function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userInitials = document.getElementById('user-initials');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');

    if (AppState.user) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        
        // Set user info
        const initials = AppState.user.name.split(' ').map(n => n[0]).join('');
        userInitials.textContent = initials;
        userName.textContent = AppState.user.name;
        userEmail.textContent = AppState.user.email;
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Handle Login
function handleLogin(userData) {
    AppState.user = userData;
    localStorage.setItem('tejoss_user', JSON.stringify(userData));
    updateAuthUI();
    
    // Redirect based on role
    if (userData.role === 'admin') {
        navigateTo('admin');
        showAlert('success', `Selamat datang Admin, ${userData.name}!`);
    } else {
        navigateTo('home');
        showAlert('success', `Selamat datang, ${userData.name}!`);
    }
}

// Handle Logout
function handleLogout() {
    // Clear admin refresh interval if exists
    if (window.adminRefreshInterval) {
        clearInterval(window.adminRefreshInterval);
        window.adminRefreshInterval = null;
    }
    
    AppState.user = null;
    localStorage.removeItem('tejoss_user');
    updateAuthUI();
    
    // Make sure header/footer are visible again
    showHeaderFooter();
    
    navigateTo('home');
    showAlert('info', 'Anda telah keluar dari akun.');
}

// Handle Newsletter Subscription
function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    showAlert('success', 'Terima kasih! Anda telah berlangganan newsletter Tejoss.');
    event.target.reset();
}

// Show Alert
function showAlert(type, message) {
    const alertClass = `alert-${type}`;
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass} fixed top-4 right-4 z-50 max-w-md fade-in`;
    alertDiv.innerHTML = `
        <div class="flex justify-between items-start">
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4">
                <i data-lucide="x" class="h-4 w-4"></i>
            </button>
        </div>
    `;
    document.body.appendChild(alertDiv);
    lucide.createIcons();

    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Check if user is authenticated and token is valid
function isAuthenticated() {
    if (!AppState.user) {
        return false;
    }
    
    const userData = localStorage.getItem('tejoss_user');
    if (!userData) {
        AppState.user = null;
        updateAuthUI();
        return false;
    }
    
    try {
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.token) {
            AppState.user = null;
            localStorage.removeItem('tejoss_user');
            updateAuthUI();
            return false;
        }
        return true;
    } catch (error) {
        AppState.user = null;
        localStorage.removeItem('tejoss_user');
        updateAuthUI();
        return false;
    }
}

// Require authentication - redirect to login if not authenticated
function requireAuth(redirectTo = 'login') {
    if (!isAuthenticated()) {
        showAlert('warning', 'Silakan login terlebih dahulu.');
        navigateTo(redirectTo);
        return false;
    }
    return true;
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount).replace('IDR', 'Rp');
}

// Format Date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format DateTime
function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Chatbot Functions
function initializeChat() {
    AppState.chatMessages = [{
        id: '1',
        type: 'bot',
        content: 'Halo! Saya adalah asisten virtual Tejoss. Saya siap membantu Anda dengan informasi layanan pertanian kami. Ada yang bisa saya bantu?',
        timestamp: new Date(),
        quickReplies: ['Info Harga', 'Cara Pesan', 'Lokasi Layanan', 'Hubungi CS']
    }];
    renderChatMessages();
}

function toggleChat() {
    AppState.isChatOpen = !AppState.isChatOpen;
    const chatWindow = document.getElementById('chat-window');
    const chatLauncher = document.getElementById('chat-launcher');
    
    if (AppState.isChatOpen) {
        chatWindow.classList.remove('hidden');
        chatLauncher.classList.add('hidden');
    } else {
        chatWindow.classList.add('hidden');
        chatLauncher.classList.remove('hidden');
    }
    
    lucide.createIcons();
}

function sendChatMessage(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    AppState.chatMessages.push({
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date()
    });
    
    input.value = '';
    renderChatMessages();
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        AppState.chatMessages.push(botResponse);
        renderChatMessages();
    }, 1000);
}

function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
        'info harga': {
            content: 'Berikut kisaran harga layanan kami:\n\n• Jasa Panen: Rp 150.000/Ha\n• Jasa Tanam: Rp 200.000/Ha\n�� Jasa Angkut: Rp 50.000/ton\n• Sewa Traktor: Rp 300.000/hari\n\nHarga dapat berubah tergantung lokasi dan kondisi lahan.',
            quickReplies: ['Pesan Sekarang', 'Lihat Semua Layanan']
        },
        'cara pesan': {
            content: 'Cara pesan layanan Tejoss sangat mudah:\n\n1. Pilih jenis layanan yang dibutuhkan\n2. Isi form pemesanan dengan detail lahan\n3. Dapatkan estimasi harga otomatis\n4. Konfirmasi pesanan dan jadwal\n5. Tim kami akan menghubungi Anda',
            quickReplies: ['Pesan Sekarang', 'Bantuan Lain']
        },
        'lokasi layanan': {
            content: 'Saat ini Tejoss melayani area:\n\n✅ Jawa Barat (Karawang, Subang, Indramayu)\n✅ Jawa Tengah (Brebes, Tegal, Pemalang)\n✅ Jawa Timur (Lamongan, Gresik, Sidoarjo)\n✅ Lampung (Lampung Utara, Tulang Bawang)',
            quickReplies: ['Cek Lokasi Saya', 'Info Lainnya']
        },
        'hubungi cs': {
            content: 'Anda bisa menghubungi customer service kami:\n\n📱 WhatsApp: +62 812-3456-7890\n📞 Telepon: +62 21-1234-5678\n📧 Email: info@tejoss.id\n\nJam operasional:\nSenin-Jumat: 08:00-17:00',
            quickReplies: ['Chat WhatsApp', 'Kirim Email']
        }
    };
    
    // Find matching response
    let response = null;
    for (const key in responses) {
        if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
            response = responses[key];
            break;
        }
    }
    
    // Default response
    if (!response) {
        response = {
            content: 'Maaf, saya tidak mengerti pertanyaan Anda. Silakan pilih dari opsi berikut atau hubungi customer service kami untuk bantuan lebih lanjut.',
            quickReplies: ['Info Harga', 'Cara Pesan', 'Hubungi CS']
        };
    }
    
    return {
        id: Date.now().toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        quickReplies: response.quickReplies
    };
}

function renderChatMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    AppState.chatMessages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message chat-message-${msg.type}`;
        msgDiv.innerHTML = `
            <p class="text-sm whitespace-pre-line">${msg.content}</p>
            <p class="text-xs mt-1 opacity-70">${msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
        `;
        chatMessages.appendChild(msgDiv);
        
        // Add quick replies for bot messages
        if (msg.type === 'bot' && msg.quickReplies) {
            const quickRepliesDiv = document.createElement('div');
            quickRepliesDiv.className = 'flex flex-wrap gap-2 mt-2';
            msg.quickReplies.forEach(reply => {
                const button = document.createElement('button');
                button.className = 'text-xs bg-white border border-green-600 text-green-600 px-3 py-1 rounded-full hover:bg-green-50';
                button.textContent = reply;
                button.onclick = () => {
                    document.getElementById('chat-input').value = reply;
                    document.getElementById('chat-input').focus();
                };
                quickRepliesDiv.appendChild(button);
            });
            chatMessages.appendChild(quickRepliesDiv);
        }
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle Quick Reply Click
function handleQuickReply(reply) {
    const input = document.getElementById('chat-input');
    input.value = reply;
    const event = new Event('submit', { bubbles: true, cancelable: true });
    input.closest('form').dispatchEvent(event);
}

// Service Selection
function selectService(serviceData) {
    AppState.selectedService = serviceData;
    navigateTo('payment');
}

// Function to select service from hardcoded data in components
function selectServiceAndOrder(serviceIndex) {
    // Define services matching those in components.js
    const services = [
        {
            id: 1,
            icon: 'wheat',
            title: 'Jasa Panen',
            name: 'Jasa Panen',
            description: 'Layanan panen dengan peralatan modern dan tenaga kerja berpengalaman',
            price: 150000,
            unit: 'Ha',
            features: ['Peralatan modern', 'Tenaga kerja terlatih', 'Panen cepat & bersih', 'Garansi kualitas']
        },
        {
            id: 2,
            icon: 'settings',
            title: 'Jasa Tanam',
            name: 'Jasa Tanam',
            description: 'Penanaman bibit dengan teknik terbaik untuk hasil optimal',
            price: 200000,
            unit: 'Ha',
            features: ['Teknik penanaman modern', 'Bibit berkualitas', 'Jadwal optimal', 'Monitoring pertumbuhan']
        },
        {
            id: 3,
            icon: 'truck',
            title: 'Jasa Angkut',
            name: 'Jasa Angkut',
            description: 'Transportasi hasil panen ke tempat tujuan dengan aman',
            price: 50000,
            unit: 'ton',
            features: ['Kendaraan khusus', 'Pengiriman aman', 'Tracking real-time', 'Asuransi barang']
        },
        {
            id: 4,
            icon: 'cog',
            title: 'Jasa Giling',
            name: 'Jasa Giling',
            description: 'Penggilingan gabah/jagung dengan mesin modern',
            price: 100000,
            unit: 'ton',
            features: ['Mesin modern', 'Hasil berkualitas', 'Proses cepat', 'Kemasan rapi']
        },
        {
            id: 5,
            icon: 'tractor',
            title: 'Sewa Traktor',
            name: 'Sewa Traktor',
            description: 'Penyewaan traktor dan alat pertanian modern',
            price: 300000,
            unit: 'hari',
            features: ['Traktor modern', 'Operator berpengalaman', 'Bahan bakar include', 'Maintenance terjamin']
        },
        {
            id: 6,
            icon: 'users',
            title: 'Tenaga Kerja',
            name: 'Tenaga Kerja',
            description: 'Penyediaan tenaga kerja pertanian terlatih',
            price: 100000,
            unit: 'orang/hari',
            features: ['Pekerja terlatih', 'Pengalaman luas', 'Asuransi kerja', 'Supervisi ketat']
        }
    ];
    
    const selectedService = services[serviceIndex];
    if (selectedService) {
        // Save to AppState and sessionStorage
        AppState.selectedService = selectedService;
        sessionStorage.setItem('selectedService', JSON.stringify(selectedService));
        
        // Navigate to payment
        navigateTo('payment');
    } else {
        showAlert('error', 'Layanan tidak ditemukan');
    }
}

// New function to select service from API data
async function selectServiceFromAPI(serviceId) {
    try {
        const service = await loadServiceDetail(serviceId);
        if (service) {
            // Save to AppState and sessionStorage
            AppState.selectedService = service;
            sessionStorage.setItem('selectedService', JSON.stringify(service));
            
            // Navigate to payment
            navigateTo('payment');
        } else {
            showAlert('error', 'Layanan tidak ditemukan');
        }
    } catch (error) {
        console.error('Error selecting service:', error);
        showAlert('error', 'Gagal memuat layanan');
    }
}

// Function to select service from database (alias for selectServiceFromAPI)
async function selectServiceFromDB(serviceId) {
    await selectServiceFromAPI(serviceId);
}

function selectPackage(serviceData, packageData) {
    AppState.selectedService = serviceData;
    AppState.selectedPackage = packageData;
    navigateTo('payment');
}

// Render Content based on section
function renderContent(section) {
    const content = document.getElementById('app-content');
    
    // Show header/footer for all pages except admin
    if (section !== 'admin') {
        showHeaderFooter();
    }
    
    // Clear admin auto-refresh interval if exists
    if (window.adminRefreshInterval) {
        clearInterval(window.adminRefreshInterval);
        window.adminRefreshInterval = null;
    }
    
    switch(section) {
        case 'home':
            content.innerHTML = renderHomePage();
            break;
        case 'services':
        case 'order':
        case 'farmers':
        case 'b2b':
            content.innerHTML = renderServicesPage();
            break;
        case 'testimonials':
            content.innerHTML = renderTestimonialsPage();
            break;
        case 'education':
            content.innerHTML = renderEducationPage();
            break;
        case 'about':
            content.innerHTML = renderAboutPage();
            break;
        case 'login':
            content.innerHTML = renderLoginPage();
            break;
        case 'payment':
            content.innerHTML = renderPaymentPage();
            // Auto-load payment details and price summary after payment page is rendered
            setTimeout(() => {
                if (typeof updatePaymentDetails === 'function') {
                    updatePaymentDetails();
                }
                if (typeof updatePriceSummary === 'function') {
                    updatePriceSummary();
                }
            }, 100);
            break;
        case 'myorders':
            content.innerHTML = renderMyOrdersPage();
            break;
        case 'profile':
            if (!AppState.user) {
                navigateTo('login');
                showAlert('warning', 'Silakan login terlebih dahulu');
                return;
            }
            content.innerHTML = renderProfileSettings();
            break;
        case 'admin':
            // Hide header and footer for admin panel
            hideHeaderFooter();
            // Render admin panel (it handles its own DOM manipulation)
            renderAdminPanel();
            break;
        default:
            content.innerHTML = renderHomePage();
    }
    
    content.classList.add('fade-in');
}

// Show/Hide Header Footer Functions
function showHeaderFooter() {
    const header = document.getElementById('header');
    const footer = document.querySelector('footer');
    const chatbot = document.getElementById('chatbot');
    
    if (header) header.style.display = 'block';
    if (footer) footer.style.display = 'block';
    if (chatbot) chatbot.style.display = 'block';
}

function hideHeaderFooter() {
    const header = document.getElementById('header');
    const footer = document.querySelector('footer');
    const chatbot = document.getElementById('chatbot');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (chatbot) chatbot.style.display = 'none';
}

// Export functions for global access
window.initializeApp = initializeApp;
window.navigateTo = navigateTo;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleUserDropdown = toggleUserDropdown;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.handleNewsletter = handleNewsletter;
window.toggleChat = toggleChat;
window.sendChatMessage = sendChatMessage;
window.handleQuickReply = handleQuickReply;
window.selectService = selectService;
window.selectServiceAndOrder = selectServiceAndOrder;
window.selectServiceFromAPI = selectServiceFromAPI;
window.selectServiceFromDB = selectServiceFromDB;
window.selectPackage = selectPackage;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.showAlert = showAlert;
window.showHeaderFooter = showHeaderFooter;
window.hideHeaderFooter = hideHeaderFooter;