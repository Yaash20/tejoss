// Additional helper functions for API integration

// Show Order Detail
async function showOrderDetail(orderId) {
    try {
        showAlert('info', 'Memuat detail pesanan...');
        
        // Get order detail from API
        const response = await API.getOrderDetail(orderId);
        const orderDetail = response.data;
        
        const statusText = {
            completed: 'Selesai',
            in_progress: 'Dalam Proses',
            scheduled: 'Terjadwal',
            cancelled: 'Dibatalkan',
            pending: 'Menunggu Pembayaran'
        };

        let detailHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold mb-2">Detail Pesanan</h2>
                <p class="text-gray-600">Order #${orderDetail.order_number}</p>
            </div>

            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600">Layanan</p>
                        <p class="font-semibold">${orderDetail.service_name}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Status</p>
                        <p class="font-semibold">${statusText[orderDetail.status]}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Jumlah</p>
                        <p class="font-semibold">${orderDetail.quantity} ${orderDetail.unit}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Total Harga</p>
                        <p class="font-semibold text-green-600">Rp ${formatCurrency(orderDetail.total_price)}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Tanggal Pelaksanaan</p>
                        <p class="font-semibold">${formatDate(orderDetail.schedule_date)}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Metode Pembayaran</p>
                        <p class="font-semibold">${orderDetail.payment_method || 'Transfer'}</p>
                    </div>
                </div>

                <div>
                    <p class="text-sm text-gray-600 mb-1">Lokasi</p>
                    <p class="font-semibold">${orderDetail.location}</p>
                </div>

                ${orderDetail.notes ? `
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Catatan</p>
                        <p>${orderDetail.notes}</p>
                    </div>
                ` : ''}

                ${orderDetail.timeline && orderDetail.timeline.length > 0 ? `
                    <div class="mt-6">
                        <h3 class="font-semibold mb-3">Timeline Pesanan</h3>
                        <div class="space-y-3">
                            ${orderDetail.timeline.map(item => `
                                <div class="flex gap-3">
                                    <div class="flex-shrink-0">
                                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <i data-lucide="check" class="h-4 w-4 text-green-600"></i>
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-semibold text-sm">${item.description}</p>
                                        <p class="text-xs text-gray-500">${formatDate(item.created_at)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        showModal('Detail Pesanan', detailHTML);
        
    } catch (error) {
        console.error('Error loading order detail:', error);
        showAlert('error', 'Gagal memuat detail pesanan');
    }
}

// Cancel Order
async function cancelOrder(orderId) {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
        return;
    }

    try {
        showAlert('info', 'Membatalkan pesanan...');
        
        // Cancel order via API
        const response = await API.cancelOrder(orderId, 'Dibatalkan oleh pelanggan');
        
        if (response.success) {
            showAlert('success', 'Pesanan berhasil dibatalkan');
            // Reload the orders page
            setTimeout(() => navigateTo('myorders'), 1000);
        } else {
            showAlert('error', response.message || 'Gagal membatalkan pesanan');
        }
    } catch (error) {
        console.error('Error canceling order:', error);
        showAlert('error', error.message || 'Gagal membatalkan pesanan');
    }
}

// Show Modal
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-bold">${title}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>
                <div>${content}</div>
                <div class="mt-6 flex justify-end">
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => lucide.createIcons(), 100);
}

// Update Price Summary (for payment page)
function updatePriceSummary() {
    const selectedService = AppState.selectedService || JSON.parse(sessionStorage.getItem('selectedService') || '{}');
    const quantityInput = document.querySelector('input[name="quantity"]');
    
    if (!quantityInput || !selectedService.price) return;
    
    const quantity = parseFloat(quantityInput.value) || 1;
    const basePrice = selectedService.price;
    const subtotal = basePrice * quantity;
    
    const quantityDisplay = document.getElementById('quantity-display');
    const subtotalPrice = document.getElementById('subtotal-price');
    const totalPrice = document.getElementById('total-price');
    
    if (quantityDisplay) quantityDisplay.textContent = `${quantity} ${selectedService.unit || 'unit'}`;
    if (subtotalPrice) subtotalPrice.textContent = ` ${formatCurrency(subtotal)}`;
    if (totalPrice) totalPrice.textContent = ` ${formatCurrency(subtotal)}`;
}

// Refresh Payment Status
async function refreshPaymentStatus(orderId, orderNumber) {
    try {
        console.log('🔄 Refreshing payment status for:', { orderId, orderNumber });
        showAlert('info', '🔄 Mengecek status pembayaran...');
        
        // Check status from Midtrans
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/payments?action=check&orderNumber=${orderNumber}`, {
            headers: {
                'Authorization': `Bearer ${AppState.user.token}`
            }
        });
        
        const data = await response.json();
        console.log('Status check response:', data);
        
        if (data.success) {
            if (data.data.database_updated) {
                showAlert('success', '✅ Pembayaran berhasil dikonfirmasi! Status telah diperbarui.');
                // Reload orders page after 2 seconds
                setTimeout(() => {
                    window.location.reload(); // Force reload to get fresh data
                }, 2000);
            } else if (data.data.already_paid) {
                showAlert('info', '✅ Pesanan ini sudah dibayar sebelumnya.');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const status = data.data.transaction_status;
                if (status === 'pending') {
                    showAlert('warning', '⏳ Pembayaran masih pending. Silakan selesaikan pembayaran terlebih dahulu atau tunggu beberapa saat.');
                } else if (status === 'not_found') {
                    showAlert('warning', '❌ Transaksi belum ditemukan. Silakan lakukan pembayaran terlebih dahulu dengan klik "Bayar Sekarang".');
                } else if (status === 'settlement' || status === 'capture') {
                    showAlert('success', '✅ Pembayaran berhasil!');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showAlert('info', `Status: ${status}`);
                }
            }
        } else {
            showAlert('error', data.message || 'Gagal mengecek status pembayaran');
        }
    } catch (error) {
        console.error('Error refreshing payment status:', error);
        showAlert('error', 'Gagal mengecek status pembayaran. Silakan coba lagi.');
    }
}

// Pay with Midtrans (for pending orders)
async function payWithMidtrans(orderId, orderNumber) {
    try {
        console.log('💳 Payment initiated for:', { orderId, orderNumber });
        
        if (!window.snap) {
            showAlert('error', 'Midtrans belum siap. Silakan refresh halaman.');
            return;
        }
        
        showAlert('info', 'Membuat transaksi pembayaran...');
        
        // Create Midtrans transaction
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/payments?action=create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.user.token}`
            },
            body: JSON.stringify({ order_id: orderId })
        });
        
        const data = await response.json();
        console.log('Midtrans create response:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Gagal membuat transaksi pembayaran');
        }
        
        console.log('✅ Midtrans token created:', data.data.token);
        
        // Open Midtrans Snap popup
        window.snap.pay(data.data.token, {
            onSuccess: async function(result) {
                console.log('✅ Payment success:', result);
                showAlert('success', 'Pembayaran berhasil! Memperbarui status...');
                
                // Wait 2 seconds for webhook to process
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check status
                await refreshPaymentStatus(orderId, orderNumber);
            },
            onPending: async function(result) {
                console.log('⏳ Payment pending:', result);
                showAlert('info', '⏳ Pembayaran pending. Silakan selesaikan pembayaran Anda, lalu klik "Cek Status".');
                
                // Reload page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            },
            onError: function(result) {
                console.log('❌ Payment error:', result);
                showAlert('error', 'Pembayaran gagal. Silakan coba lagi.');
            },
            onClose: function() {
                console.log('🚪 Payment popup closed');
                showAlert('info', 'Popup pembayaran ditutup. Jika Anda sudah membayar, klik "Cek Status" untuk memperbarui.');
            }
        });
        
    } catch (error) {
        console.error('❌ Error paying with Midtrans:', error);
        showAlert('error', error.message || 'Gagal membuat pembayaran. ' + (error.response ? error.response.message : ''));
    }
}

// Export functions to window
window.showOrderDetail = showOrderDetail;
window.cancelOrder = cancelOrder;
window.showModal = showModal;
window.updatePriceSummary = updatePriceSummary;
window.refreshPaymentStatus = refreshPaymentStatus;
window.payWithMidtrans = payWithMidtrans;
