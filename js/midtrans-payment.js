// Midtrans Payment Integration for Vanilla JavaScript

// Function to handle payment submission with Midtrans
async function handlePaymentSubmitWithMidtrans(event) {
    event.preventDefault();
    
    if (!AppState.user) {
        showAlert('error', 'Silakan login terlebih dahulu');
        navigateTo('login');
        return;
    }
    
    // Check if Midtrans Snap is loaded
    if (typeof window.snap === 'undefined') {
        showAlert('error', 'Midtrans belum siap. Silakan refresh halaman.');
        console.error('Midtrans Snap not loaded. Check if script is included in index.html');
        return;
    }
    
    const formData = new FormData(event.target);
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    try {
        // Disable button and show loading
        button.disabled = true;
        button.innerHTML = '<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span> Memproses...';
        
        const orderData = {
            service_id: parseInt(formData.get('service_id')),
            quantity: parseFloat(formData.get('quantity')),
            location: formData.get('location'),
            schedule_date: formData.get('schedule_date'),
            notes: formData.get('notes')
        };
        
        console.log('Creating order...', orderData);
        
        // Step 1: Create order in backend
        const orderResponse = await API.createOrder(orderData);
        
        if (!orderResponse.success) {
            throw new Error(orderResponse.message || 'Gagal membuat pesanan');
        }
        
        console.log('Order created:', orderResponse.data);
        
        const orderId = orderResponse.data.id;
        const orderNumber = orderResponse.data.order_number;
        
        // Step 2: Create Midtrans transaction token
        console.log('Creating Midtrans transaction for order ID:', orderId);
        
        const midtransResponse = await fetch(`${API_CONFIG.BASE_URL}/api/payments/midtrans/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.user.token}`
            },
            body: JSON.stringify({ order_id: orderId })
        });
        
        const midtransData = await midtransResponse.json();
        
        if (!midtransResponse.ok || !midtransData.success) {
            throw new Error(midtransData.message || 'Gagal membuat transaksi pembayaran');
        }
        
        console.log('Midtrans token created:', midtransData.data.token);
        
        // Step 3: Open Midtrans Snap popup
        window.snap.pay(midtransData.data.token, {
            onSuccess: async function(result) {
                console.log('Payment success:', result);
                showAlert('success', 'Pembayaran berhasil! Memperbarui status...');
                
                // Manual check payment status from Midtrans after success
                try {
                    const statusCheck = await fetch(`${API_CONFIG.BASE_URL}/api/payments/midtrans/status/${orderNumber}`, {
                        headers: {
                            'Authorization': `Bearer ${AppState.user.token}`
                        }
                    });
                    const statusData = await statusCheck.json();
                    console.log('Payment status checked:', statusData);
                    
                    // Give backend time to process webhook
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    console.error('Error checking payment status:', error);
                }
                
                // Clear selected service
                AppState.selectedService = null;
                sessionStorage.removeItem('selectedService');
                
                // Navigate to my orders page
                setTimeout(() => {
                    navigateTo('myorders');
                }, 1500);
            },
            onPending: async function(result) {
                console.log('Payment pending:', result);
                showAlert('info', 'Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran.');
                
                // Check status
                try {
                    await fetch(`${API_CONFIG.BASE_URL}/api/payments/midtrans/status/${orderNumber}`, {
                        headers: {
                            'Authorization': `Bearer ${AppState.user.token}`
                        }
                    });
                } catch (error) {
                    console.error('Error checking payment status:', error);
                }
                
                // Clear selected service
                AppState.selectedService = null;
                sessionStorage.removeItem('selectedService');
                
                // Navigate to my orders page
                setTimeout(() => {
                    navigateTo('myorders');
                }, 1500);
            },
            onError: function(result) {
                console.log('Payment error:', result);
                showAlert('error', 'Pembayaran gagal. Silakan coba lagi.');
                
                // Re-enable button
                button.disabled = false;
                button.textContent = originalText;
            },
            onClose: function() {
                console.log('Payment popup closed without finishing payment');
                showAlert('info', 'Anda menutup halaman pembayaran. Pesanan sudah dibuat, Anda dapat melanjutkan pembayaran nanti di halaman "Pesanan Saya".');
                
                // Clear selected service
                AppState.selectedService = null;
                sessionStorage.removeItem('selectedService');
                
                // Re-enable button
                button.disabled = false;
                button.textContent = originalText;
                
                // Navigate to my orders page
                setTimeout(() => {
                    navigateTo('myorders');
                }, 2000);
            }
        });
        
    } catch (error) {
        console.error('Payment error:', error);
        showAlert('error', error.message || 'Terjadi kesalahan. Silakan coba lagi.');
        
        // Re-enable button
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Override the original handlePaymentSubmit function
if (typeof window !== 'undefined') {
    window.handlePaymentSubmit = handlePaymentSubmitWithMidtrans;
}

console.log('✅ Midtrans payment integration loaded');
