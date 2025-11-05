// Tejoss Platform - Page Components

// Home Page
function renderHomePage() {
    return `
        <div class="min-h-screen">
            <!-- Hero Section -->
            <section class="relative bg-gradient-to-br from-green-50 to-green-100 overflow-hidden" style="padding-top: 6rem; padding-bottom: 6rem;">
                <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <div class="mb-6">
                            <span class="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                #1 Platform Jasa Pertanian Indonesia
                            </span>
                        </div>
                        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style="line-height: 1.1; font-weight: 800;">
                            Solusi <span class="text-green-600">One-Stop</span><br>
                            Jasa Pertanian Modern
                        </h1>
                        <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto" style="line-height: 1.75;">
                            Dari tanam hingga panen, dari angkut hingga giling. Tejoss hadir dengan layanan jasa pertanian 
                            profesional yang transparan, berkualitas, dan terpercaya untuk kesuksesan pertanian Anda.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button onclick="navigateTo('order')" class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md font-medium shadow-lg hover:shadow-xl transition-all" style="font-size: 1.125rem;">
                                Pesan Jasa Pertanian Sekarang
                            </button>
                            <button onclick="navigateTo('services')" class="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-md font-medium transition-all" style="font-size: 1.125rem;">
                                Lihat Layanan
                            </button>
                        </div>
                        <div class="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
                            <div class="flex items-center gap-2">
                                <i data-lucide="check-circle" class="h-5 w-5 text-green-600"></i>
                                <span>Gratis Konsultasi</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="check-circle" class="h-5 w-5 text-green-600"></i>
                                <span>Harga Transparan</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="check-circle" class="h-5 w-5 text-green-600"></i>
                                <span>Garansi Kualitas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section class="py-20 bg-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl md:text-4xl text-gray-900 mb-4" style="font-weight: 700; line-height: 1.2;">
                            Mengapa Memilih Tejoss?
                        </h2>
                        <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto" style="line-height: 1.75;">
                            Kami berkomitmen memberikan layanan jasa pertanian terbaik dengan standar kualitas tinggi
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div class="card text-center p-6 hover:shadow-lg transition-shadow">
                            <div class="mb-4 flex justify-center">
                                <div class="p-3 bg-green-50 rounded-full">
                                    <i data-lucide="shield" class="h-6 w-6 text-green-600"></i>
                                </div>
                            </div>
                            <h3 class="text-gray-900 mb-2" style="font-weight: 600; font-size: 1.125rem;">Transparansi Harga</h3>
                            <p class="text-gray-600" style="font-size: 0.875rem; line-height: 1.5;">Harga jelas dan transparan tanpa biaya tersembunyi</p>
                        </div>
                        <div class="card text-center p-6 hover:shadow-lg transition-shadow">
                            <div class="mb-4 flex justify-center">
                                <div class="p-3 bg-green-50 rounded-full">
                                    <i data-lucide="check-circle" class="h-6 w-6 text-green-600"></i>
                                </div>
                            </div>
                            <h3 class="text-gray-900 mb-2" style="font-weight: 600; font-size: 1.125rem;">Standar Kualitas</h3>
                            <p class="text-gray-600" style="font-size: 0.875rem; line-height: 1.5;">Layanan berkualitas tinggi dengan pekerja berpengalaman</p>
                        </div>
                        <div class="card text-center p-6 hover:shadow-lg transition-shadow">
                            <div class="mb-4 flex justify-center">
                                <div class="p-3 bg-green-50 rounded-full">
                                    <i data-lucide="clock" class="h-6 w-6 text-green-600"></i>
                                </div>
                            </div>
                            <h3 class="text-gray-900 mb-2" style="font-weight: 600; font-size: 1.125rem;">Layanan 24/7</h3>
                            <p class="text-gray-600" style="font-size: 0.875rem; line-height: 1.5;">Siap melayani kebutuhan pertanian Anda kapan saja</p>
                        </div>
                        <div class="card text-center p-6 hover:shadow-lg transition-shadow">
                            <div class="mb-4 flex justify-center">
                                <div class="p-3 bg-green-50 rounded-full">
                                    <i data-lucide="users" class="h-6 w-6 text-green-600"></i>
                                </div>
                            </div>
                            <h3 class="text-gray-900 mb-2" style="font-weight: 600; font-size: 1.125rem;">Tim Profesional</h3>
                            <p class="text-gray-600" style="font-size: 0.875rem; line-height: 1.5;">Tenaga kerja terlatih dan peralatan modern</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Services Preview -->
            <section class="py-20 bg-green-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl md:text-4xl text-gray-900 mb-4" style="font-weight: 700; line-height: 1.2;">
                            Layanan Unggulan Kami
                        </h2>
                        <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto" style="line-height: 1.75;">
                            Layanan jasa pertanian lengkap dengan harga yang kompetitif dan transparan
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div class="card bg-white p-6 hover:shadow-xl transition-all">
                            <i data-lucide="wheat" class="h-8 w-8 text-green-600 mb-4"></i>
                            <h3 class="text-gray-900 mb-2" style="font-weight: 600; font-size: 1.125rem;">Jasa Panen</h3>
                            <p class="text-gray-600 mb-4" style="font-size: 0.875rem; line-height: 1.5;">Panen hasil tani dengan peralatan modern dan efisien</p>
                            <div class="text-green-600" style="font-weight: 600; font-size: 1rem;">Mulai Rp 150.000/Ha</div>
                        </div>
                        <div class="card bg-white p-6 hover:shadow-xl transition-all">
                            <i data-lucide="settings" class="h-8 w-8 text-green-600 mb-4"></i>
                            <h3 class="text-gray-900 mb-2" style="font-weight: 600; font-size: 1.125rem;">Jasa Tanam</h3>
                            <p class="text-gray-600 mb-4" style="font-size: 0.875rem; line-height: 1.5;">Penanaman bibit dengan teknik terbaik untuk hasil optimal</p>
                            <div class="text-green-600" style="font-weight: 600; font-size: 1rem;">Mulai Rp 200.000/Ha</div>
                        </div>
                        <div class="card bg-white p-6 hover:shadow-xl transition-all">
                            <i data-lucide="truck" class="h-8 w-8 text-green-600 mb-4"></i>
                            <h3 class="text-gray-900 mb-2" style="font-weight: 600; font-size: 1.125rem;">Jasa Angkut</h3>
                            <p class="text-gray-600 mb-4" style="font-size: 0.875rem; line-height: 1.5;">Transportasi hasil panen ke tempat tujuan dengan aman</p>
                            <div class="text-green-600" style="font-weight: 600; font-size: 1rem;">Mulai Rp 50.000/ton</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <button onclick="navigateTo('services')" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md">
                            Lihat Semua Layanan
                        </button>
                    </div>
                </div>
            </section>

            <!-- Testimonials -->
            <section class="py-20 bg-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl md:text-4xl text-gray-900 mb-4" style="font-weight: 700; line-height: 1.2;">
                            Kata Mereka Tentang Tejoss
                        </h2>
                        <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto" style="line-height: 1.75;">
                            Ribuan petani sudah merasakan manfaat layanan jasa pertanian kami
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        ${generateTestimonialCards()}
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="py-20 bg-green-600">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 class="text-3xl md:text-4xl text-white mb-4" style="font-weight: 700; line-height: 1.2;">
                        Siap Meningkatkan Produktivitas Pertanian Anda?
                    </h2>
                    <p class="text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto" style="line-height: 1.75;">
                        Bergabunglah dengan ribuan petani yang sudah merasakan kemudahan dan efisiensi layanan Tejoss
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onclick="navigateTo('order')" class="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-md font-medium shadow-lg transition-all" style="font-size: 1.125rem;">
                            Mulai Pesan Sekarang
                        </button>
                        <button onclick="navigateTo('farmers')" class="border-2 border-white text-white hover:bg-green-700 px-8 py-4 rounded-md font-medium transition-all" style="font-size: 1.125rem;">
                            Pelajari Lebih Lanjut
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function generateTestimonialCards() {
    const testimonials = [
        {
            name: "Pak Budi Santoso",
            location: "Petani Padi, Karawang",
            text: "Tejoss sangat membantu saat musim panen. Pekerja profesional dan harga transparan. Hasil panen jadi lebih maksimal!",
            rating: 5
        },
        {
            name: "Ibu Sari Dewi",
            location: "Petani Jagung, Lampung",
            text: "Pertama kali pakai jasa Tejoss langsung puas. Pelayanan cepat, harga sesuai, dan hasilnya memuaskan.",
            rating: 5
        },
        {
            name: "Pak Ahmad Fauzi",
            location: "Kelompok Tani Makmur",
            text: "Kerjasama dengan Tejoss sudah 2 tahun. Selalu on-time dan kualitas kerja tidak pernah mengecewakan.",
            rating: 5
        }
    ];

    return testimonials.map(t => `
        <div class="card p-6 hover:shadow-xl transition-all">
            <div class="flex mb-4">
                ${Array(t.rating).fill('').map(() => '<i data-lucide="star" class="h-5 w-5 star"></i>').join('')}
            </div>
            <p class="text-gray-600 mb-4" style="font-style: italic; line-height: 1.6;">"${t.text}"</p>
            <div>
                <p class="text-gray-900" style="font-weight: 600;">${t.name}</p>
                <p class="text-gray-500" style="font-size: 0.875rem;">${t.location}</p>
            </div>
        </div>
    `).join('');
}

// Services Page
function renderServicesPage() {
    return `
        <div class="min-h-screen py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h1 class="text-4xl md:text-5xl text-gray-900 mb-4" style="font-weight: 800; line-height: 1.1;">
                        Layanan Jasa Pertanian Lengkap
                    </h1>
                    <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto" style="line-height: 1.75;">
                        Solusi one-stop untuk semua kebutuhan pertanian Anda dengan harga transparan dan kualitas terjamin
                    </p>
                </div>

                <!-- Service Tabs -->
                <div class="mb-8">
                    <div class="flex overflow-x-auto border-b">
                        <button onclick="showTab('services')" class="tab-button active px-6 py-3 whitespace-nowrap" data-tab="services">Layanan Utama</button>
                        <button onclick="showTab('subscription')" class="tab-button px-6 py-3 whitespace-nowrap" data-tab="subscription">Paket Langganan</button>
                        <button onclick="showTab('premium')" class="tab-button px-6 py-3 whitespace-nowrap" data-tab="premium">Layanan Premium</button>
                        <button onclick="showTab('farmers')" class="tab-button px-6 py-3 whitespace-nowrap" data-tab="farmers">Untuk Petani</button>
                        <button onclick="showTab('b2b')" class="tab-button px-6 py-3 whitespace-nowrap" data-tab="b2b">Kemitraan B2B</button>
                    </div>
                </div>

                <!-- Tab Contents -->
                <div id="tab-services" class="tab-content">
                    ${renderMainServicesTab()}
                </div>
                <div id="tab-subscription" class="tab-content hidden">
                    ${renderSubscriptionTab()}
                </div>
                <div id="tab-premium" class="tab-content hidden">
                    ${renderPremiumTab()}
                </div>
                <div id="tab-farmers" class="tab-content hidden">
                    ${renderFarmersTab()}
                </div>
                <div id="tab-b2b" class="tab-content hidden">
                    ${renderB2BTab()}
                </div>
            </div>
        </div>
    `;
}

function renderMainServicesTab() {
    const services = [
        {
            id: 1,
            icon: 'wheat',
            title: 'Jasa Panen',
            name: 'Jasa Panen',
            description: 'Layanan panen dengan peralatan modern dan tenaga kerja berpengalaman',
            price: 'Rp 150.000/Ha',
            priceValue: 150000,
            unit: 'Ha',
            features: ['Peralatan modern', 'Tenaga kerja terlatih', 'Panen cepat & bersih', 'Garansi kualitas'],
            popular: true
        },
        {
            id: 2,
            icon: 'settings',
            title: 'Jasa Tanam',
            name: 'Jasa Tanam',
            description: 'Penanaman bibit dengan teknik terbaik untuk hasil optimal',
            price: 'Rp 200.000/Ha',
            priceValue: 200000,
            unit: 'Ha',
            features: ['Teknik penanaman modern', 'Bibit berkualitas', 'Jadwal optimal', 'Monitoring pertumbuhan']
        },
        {
            id: 3,
            icon: 'truck',
            title: 'Jasa Angkut',
            name: 'Jasa Angkut',
            description: 'Transportasi hasil panen ke tempat tujuan dengan aman',
            price: 'Rp 50.000/ton',
            priceValue: 50000,
            unit: 'ton',
            features: ['Kendaraan khusus', 'Pengiriman aman', 'Tracking real-time', 'Asuransi barang']
        },
        {
            id: 4,
            icon: 'cog',
            title: 'Jasa Giling',
            name: 'Jasa Giling',
            description: 'Penggilingan gabah/jagung dengan mesin modern',
            price: 'Rp 100.000/ton',
            priceValue: 100000,
            unit: 'ton',
            features: ['Mesin modern', 'Hasil berkualitas', 'Proses cepat', 'Kemasan rapi']
        },
        {
            id: 5,
            icon: 'tractor',
            title: 'Sewa Traktor',
            name: 'Sewa Traktor',
            description: 'Penyewaan traktor dan alat pertanian modern',
            price: 'Rp 300.000/hari',
            priceValue: 300000,
            unit: 'hari',
            features: ['Traktor modern', 'Operator berpengalaman', 'Bahan bakar include', 'Maintenance terjamin']
        },
        {
            id: 6,
            icon: 'users',
            title: 'Tenaga Kerja',
            name: 'Tenaga Kerja',
            description: 'Penyediaan tenaga kerja pertanian terlatih',
            price: 'Rp 100.000/orang/hari',
            priceValue: 100000,
            unit: 'orang/hari',
            features: ['Pekerja terlatih', 'Pengalaman luas', 'Asuransi kerja', 'Supervisi ketat']
        }
    ];

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${services.map((service, index) => `
                <div class="card relative ${service.popular ? 'ring-2 ring-green-500' : ''} hover:shadow-xl transition-all">
                    ${service.popular ? '<span class="absolute -top-2 left-4 bg-green-500 text-white px-3 py-1 rounded-full" style="font-size: 0.75rem; font-weight: 600;">Paling Populer</span>' : ''}
                    <div class="p-6">
                        <div class="flex items-center gap-4 mb-4">
                            <i data-lucide="${service.icon}" class="h-8 w-8 text-green-600"></i>
                            <h3 class="text-gray-900" style="font-size: 1.125rem; font-weight: 600;">${service.title}</h3>
                        </div>
                        <p class="text-gray-600 mb-4" style="font-size: 0.875rem; line-height: 1.5;">${service.description}</p>
                        <div class="text-green-600 mb-4" style="font-size: 1.5rem; font-weight: 700;">${service.price}</div>
                        <ul class="space-y-2 mb-6">
                            ${service.features.map(f => `
                                <li class="flex items-center gap-2 text-gray-600" style="font-size: 0.875rem;">
                                    <i data-lucide="check-circle" class="h-4 w-4 text-green-500 flex-shrink-0"></i>
                                    <span>${f}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <button onclick="selectServiceFromDB(${service.id})" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md font-medium shadow-md hover:shadow-lg transition-all">
                            Pesan Sekarang
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSubscriptionTab() {
    const packages = [
        {
            name: 'Paket Starter',
            price: 'Rp 2.500.000',
            period: '/bulan',
            description: 'Untuk petani pemula atau lahan kecil',
            features: [
                '2x layanan panen per bulan',
                '1x layanan tanam per bulan',
                'Konsultasi gratis',
                'Diskon 10% untuk layanan tambahan',
                'Priority booking'
            ]
        },
        {
            name: 'Paket Professional',
            price: 'Rp 4.500.000',
            period: '/bulan',
            description: 'Untuk petani berpengalaman dengan lahan sedang',
            features: [
                '4x layanan panen per bulan',
                '3x layanan tanam per bulan',
                '2x layanan angkut per bulan',
                'Konsultasi unlimited',
                'Diskon 15% untuk layanan tambahan',
                'Priority booking + fast response',
                'Laporan bulanan'
            ],
            recommended: true
        },
        {
            name: 'Paket Enterprise',
            price: 'Rp 8.000.000',
            period: '/bulan',
            description: 'Untuk petani skala besar atau korporasi',
            features: [
                'Unlimited layanan panen',
                'Unlimited layanan tanam',
                'Unlimited layanan angkut',
                'Dedicated account manager',
                'Diskon 25% untuk layanan tambahan',
                'Priority booking + same day response',
                'Laporan real-time',
                'Custom solution',
                'Training team'
            ]
        }
    ];

    return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${packages.map(pkg => `
                <div class="card relative ${pkg.recommended ? 'ring-2 ring-green-500' : ''}">
                    ${pkg.recommended ? '<span class="absolute -top-2 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">Rekomendasi</span>' : ''}
                    <div class="p-6 text-center">
                        <h3 class="text-xl font-semibold mb-2">${pkg.name}</h3>
                        <div class="text-3xl font-bold text-green-600 mb-2">
                            ${pkg.price}<span class="text-base text-gray-500">${pkg.period}</span>
                        </div>
                        <p class="text-gray-600 mb-6">${pkg.description}</p>
                        <ul class="space-y-3 mb-6 text-left">
                            ${pkg.features.map(f => `
                                <li class="flex items-center gap-2 text-sm text-gray-600">
                                    <i data-lucide="check-circle" class="h-4 w-4 text-green-500 flex-shrink-0"></i>
                                    <span>${f}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <button onclick="navigateTo('payment')" class="w-full ${pkg.recommended ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded-md">
                            Pilih Paket
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPremiumTab() {
    const premiumServices = [
        {
            title: 'Konsultasi Ahli Pertanian',
            description: 'Konsultasi dengan ahli pertanian berpengalaman',
            price: 'Rp 500.000/sesi'
        },
        {
            title: 'Soil Testing & Analysis',
            description: 'Analisis tanah komprehensif untuk optimasi hasil',
            price: 'Rp 750.000/lokasi'
        },
        {
            title: 'Pest Control Management',
            description: 'Pengendalian hama terpadu dengan teknologi modern',
            price: 'Rp 300.000/Ha'
        },
        {
            title: 'Irrigation System Setup',
            description: 'Instalasi sistem irigasi modern dan efisien',
            price: 'Mulai Rp 5.000.000'
        }
    ];

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${premiumServices.map(service => `
                <div class="card p-6">
                    <div class="flex items-center gap-2 mb-2">
                        <i data-lucide="star" class="h-5 w-5 text-yellow-500"></i>
                        <h3 class="text-lg font-semibold">${service.title}</h3>
                    </div>
                    <p class="text-gray-600 mb-4">${service.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xl font-bold text-green-600">${service.price}</span>
                        <button onclick="navigateTo('payment')" class="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-md">
                            Pesan Sekarang
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderFarmersTab() {
    return `
        <div>
            <!-- Hero for Farmers -->
            <section class="text-center mb-16">
                <span class="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    Khusus untuk Petani Indonesia
                </span>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Tingkatkan Produktivitas<br>
                    <span class="text-green-600">Pertanian Anda</span>
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Jadilah bagian dari revolusi pertanian modern. Dengan Tejoss, petani skala kecil-menengah 
                    dapat mengakses teknologi canggih tanpa investasi besar.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <button onclick="navigateTo('order')" class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md text-lg">
                        Mulai Gratis Sekarang
                    </button>
                    <button class="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-md text-lg">
                        Konsultasi Gratis
                    </button>
                </div>
                <p class="text-sm text-gray-500">💡 Konsultasi gratis + estimasi harga tanpa komitmen</p>
            </section>

            <!-- Benefits -->
            <section class="mb-16">
                <h3 class="text-3xl font-bold text-gray-900 text-center mb-12">
                    Keuntungan Menggunakan Jasa Tejoss
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${renderFarmerBenefits()}
                </div>
            </section>

            <!-- Comparison Table -->
            <section class="mb-16">
                <h3 class="text-3xl font-bold text-gray-900 text-center mb-12">
                    Perbandingan: Konvensional vs Tejoss
                </h3>
                <div class="card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-green-50">
                                <tr>
                                    <th class="px-6 py-4 text-left font-semibold">Aspek</th>
                                    <th class="px-6 py-4 text-left font-semibold">Cara Konvensional</th>
                                    <th class="px-6 py-4 text-left font-semibold text-green-600">Dengan Tejoss</th>
                                    <th class="px-6 py-4 text-left font-semibold text-green-600">Penghematan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t">
                                    <td class="px-6 py-4 font-medium">Biaya Investasi Awal</td>
                                    <td class="px-6 py-4 text-gray-600">Rp 50-100 juta (alat & mesin)</td>
                                    <td class="px-6 py-4 text-green-600 font-medium">Rp 0 (pay per use)</td>
                                    <td class="px-6 py-4"><span class="badge badge-green">-100%</span></td>
                                </tr>
                                <tr class="border-t">
                                    <td class="px-6 py-4 font-medium">Waktu Panen (1 Ha)</td>
                                    <td class="px-6 py-4 text-gray-600">5-7 hari</td>
                                    <td class="px-6 py-4 text-green-600 font-medium">1-2 hari</td>
                                    <td class="px-6 py-4"><span class="badge badge-green">-70%</span></td>
                                </tr>
                                <tr class="border-t">
                                    <td class="px-6 py-4 font-medium">Tenaga Kerja (1 Ha)</td>
                                    <td class="px-6 py-4 text-gray-600">15-20 orang</td>
                                    <td class="px-6 py-4 text-green-600 font-medium">5-8 orang</td>
                                    <td class="px-6 py-4"><span class="badge badge-green">-60%</span></td>
                                </tr>
                                <tr class="border-t">
                                    <td class="px-6 py-4 font-medium">Biaya Maintenance</td>
                                    <td class="px-6 py-4 text-gray-600">Rp 5-10 juta/tahun</td>
                                    <td class="px-6 py-4 text-green-600 font-medium">Rp 0</td>
                                    <td class="px-6 py-4"><span class="badge badge-green">-100%</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function renderFarmerBenefits() {
    const benefits = [
        {
            icon: 'dollar-sign',
            title: 'Hemat Biaya Operasional',
            description: 'Hemat hingga 40% biaya operasional dibanding sistem konvensional'
        },
        {
            icon: 'clock',
            title: 'Efisiensi Waktu',
            description: 'Percepat proses pertanian dengan teknologi modern'
        },
        {
            icon: 'trending-up',
            title: 'Tingkatkan Produktivitas',
            description: 'Hasil panen lebih optimal dengan teknologi tepat guna'
        },
        {
            icon: 'shield',
            title: 'Mitigasi Risiko',
            description: 'Kurangi risiko kegagalan dengan dukungan ahli'
        }
    ];

    return benefits.map(b => `
        <div class="card text-center p-6">
            <div class="mb-4 flex justify-center">
                <div class="p-3 bg-green-50 rounded-full">
                    <i data-lucide="${b.icon}" class="h-8 w-8 text-green-600"></i>
                </div>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">${b.title}</h4>
            <p class="text-gray-600 text-sm">${b.description}</p>
        </div>
    `).join('');
}

function renderB2BTab() {
    return `
        <div>
            <!-- B2B Hero -->
            <section class="text-center mb-16">
                <span class="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    Solusi B2B Pertanian
                </span>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Kemitraan Strategis untuk<br>
                    <span class="text-green-600">Bisnis Pertanian Anda</span>
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Solusi terintegrasi untuk koperasi, kelompok tani, dan perusahaan agribisnis. 
                    Tingkatkan efisiensi operasional dengan teknologi dan expertise kami.
                </p>
            </section>

            <!-- B2B Services -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                ${renderB2BServices()}
            </div>

            <!-- Contact Form -->
            <section class="card p-8 max-w-2xl mx-auto">
                <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Hubungi Tim B2B Kami
                </h3>
                <form onsubmit="handleB2BForm(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                            <input type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Contact Person</label>
                            <input type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-md">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                                <input type="tel" required class="w-full px-4 py-2 border border-gray-300 rounded-md">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                            <textarea rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-md"></textarea>
                        </div>
                        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md">
                            Kirim Permintaan
                        </button>
                    </div>
                </form>
            </section>
        </div>
    `;
}

function renderB2BServices() {
    const services = [
        {
            title: 'Manajemen Lahan Korporasi',
            description: 'Pengelolaan lahan pertanian skala besar dengan teknologi modern',
            minSize: '50 Ha'
        },
        {
            title: 'Kemitraan Koperasi',
            description: 'Program khusus untuk koperasi dan kelompok tani',
            minSize: '20 Ha total'
        },
        {
            title: 'Contract Farming',
            description: 'Kerjasama kontrak jangka panjang dengan garansi kualitas',
            minSize: '100 Ha'
        }
    ];

    return services.map(s => `
        <div class="card p-6">
            <i data-lucide="building-2" class="h-8 w-8 text-green-600 mb-4"></i>
            <h4 class="font-semibold text-gray-900 mb-2">${s.title}</h4>
            <p class="text-gray-600 text-sm mb-4">${s.description}</p>
            <p class="text-sm text-green-600 font-medium">Min. ${s.minSize}</p>
        </div>
    `).join('');
}

// Tab Switching Function
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
    
    // Add active class to clicked button
    const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Re-initialize icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Handle B2B Form
function handleB2BForm(event) {
    event.preventDefault();
    showAlert('success', 'Terima kasih! Tim B2B kami akan menghubungi Anda dalam 24 jam.');
    event.target.reset();
}

// Testimonials Page
function renderTestimonialsPage() {
    return `
        <div class="min-h-screen py-12 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">Testimoni Petani</h1>
                    <p class="text-xl text-gray-600">Dengar langsung dari petani yang sudah merasakan manfaat Tejoss</p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    <div class="card p-6 text-center">
                        <div class="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                        <div class="text-gray-600">Petani Tergabung</div>
                    </div>
                    <div class="card p-6 text-center">
                        <div class="text-4xl font-bold text-green-600 mb-2">50,000+</div>
                        <div class="text-gray-600">Lahan Dilayani</div>
                    </div>
                    <div class="card p-6 text-center">
                        <div class="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
                        <div class="text-gray-600">Rating Kepuasan</div>
                    </div>
                    <div class="card p-6 text-center">
                        <div class="text-4xl font-bold text-green-600 mb-2">98%</div>
                        <div class="text-gray-600">Customer Retention</div>
                    </div>
                </div>

                <!-- Testimonials Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${generateDetailedTestimonials()}
                </div>

                <!-- CTA -->
                <div class="text-center mt-16">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Ingin Berbagi Pengalaman Anda?</h3>
                    <button onclick="navigateTo('order')" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md">
                        Bergabung Sekarang
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateDetailedTestimonials() {
    const testimonials = [
        {
            name: "Pak Sumarno",
            location: "Petani Padi, Subang",
            farm: "Lahan 2 Ha",
            quote: "Sejak pakai Tejoss, biaya operasional saya turun drastis. Tidak perlu beli traktor mahal, cukup sewa saat butuh. Hasilnya malah lebih bagus!",
            beforeAfter: { before: "Biaya Rp 8 juta/musim", after: "Biaya Rp 4.5 juta/musim" },
            rating: 5
        },
        {
            name: "Ibu Kartini",
            location: "Petani Jagung, Lampung",
            farm: "Lahan 1.5 Ha",
            quote: "Dulunya panen jagung butuh 2 minggu, sekarang cuma 3 hari! Tim Tejoss profesional banget, hasilnya juga lebih bersih.",
            beforeAfter: { before: "Panen 14 hari", after: "Panen 3 hari" },
            rating: 5
        },
        {
            name: "Pak Ahmad",
            location: "Petani Kedelai, Solo",
            farm: "Lahan 3 Ha",
            quote: "Yang paling saya suka itu transparansi harganya. Jelas dari awal berapa biayanya, tidak ada tambahan-tambahan. Pelayanannya juga bagus.",
            beforeAfter: { before: "Hasil 2.5 ton/Ha", after: "Hasil 3.2 ton/Ha" },
            rating: 5
        },
        {
            name: "Ibu Lastri",
            location: "Petani Sayuran, Cianjur",
            farm: "Lahan 0.5 Ha",
            quote: "Awalnya ragu karena lahan saya kecil. Ternyata Tejoss tetap melayani dengan baik. Sekarang hasil panen saya meningkat 30%!",
            beforeAfter: { before: "Panen 500 kg", after: "Panen 650 kg" },
            rating: 5
        },
        {
            name: "Pak Hendro",
            location: "Kelompok Tani Makmur, Karawang",
            farm: "Lahan 10 Ha",
            quote: "Kelompok tani kami sudah kerjasama 2 tahun. Sistem paket langganan sangat membantu menghemat biaya. Recommended!",
            beforeAfter: { before: "Biaya Rp 30 juta/tahun", after: "Biaya Rp 20 juta/tahun" },
            rating: 5
        },
        {
            name: "Ibu Siti",
            location: "Petani Padi, Indramayu",
            farm: "Lahan 1 Ha",
            quote: "Saya petani perempuan, sangat terbantu dengan adanya Tejoss. Tidak perlu repot cari pekerja manual. Tinggal pesan, semuanya diurus!",
            beforeAfter: { before: "Waktu 10 hari", after: "Waktu 2 hari" },
            rating: 5
        }
    ];

    return testimonials.map(t => `
        <div class="card p-6">
            <div class="flex mb-4">
                ${Array(t.rating).fill('').map(() => '<i data-lucide="star" class="h-5 w-5 star"></i>').join('')}
            </div>
            <p class="text-gray-600 mb-4 italic">"${t.quote}"</p>
            <div class="bg-green-50 p-4 rounded-lg mb-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-gray-500">Sebelum:</span>
                        <p class="font-medium text-red-600">${t.beforeAfter.before}</p>
                    </div>
                    <div>
                        <span class="text-gray-500">Setelah:</span>
                        <p class="font-medium text-green-600">${t.beforeAfter.after}</p>
                    </div>
                </div>
            </div>
            <div>
                <p class="font-semibold text-gray-900">${t.name}</p>
                <p class="text-sm text-gray-500">${t.location}</p>
                <p class="text-sm text-green-600">${t.farm}</p>
            </div>
        </div>
    `).join('');
}

// Education Page
function renderEducationPage() {
    const articles = [
        {
            title: "Teknik Penanaman Padi Modern untuk Hasil Maksimal",
            category: "Budidaya",
            readTime: "8 menit",
            description: "Pelajari teknik penanaman padi terbaru yang dapat meningkatkan produktivitas hingga 30%"
        },
        {
            title: "Manajemen Keuangan Pertanian untuk Petani Kecil",
            category: "Keuangan",
            readTime: "12 menit",
            description: "Tips mengelola cash flow dan merencanakan budget pertanian yang efektif"
        },
        {
            title: "Pengendalian Hama dan Penyakit Tanaman Secara Terpadu",
            category: "Perlindungan",
            readTime: "15 menit",
            description: "Strategi IPM (Integrated Pest Management) untuk menjaga kesehatan tanaman"
        }
    ];

    return `
        <div class="min-h-screen py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">
                        <i data-lucide="book-open" class="inline-block h-10 w-10 text-green-600 mr-3"></i>
                        Pusat Edukasi Pertanian
                    </h1>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Tingkatkan pengetahuan pertanian Anda dengan artikel, video, dan panduan dari para ahli
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${articles.map((article, index) => `
                        <div class="card">
                            <div class="p-6">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="badge badge-green">${article.category}</span>
                                    <span class="text-sm text-gray-500">${article.readTime}</span>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-2">${article.title}</h3>
                                <p class="text-gray-600 mb-4">${article.description}</p>
                                <button class="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md">
                                    Baca Selengkapnya
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="text-center mt-12">
                    <button onclick="navigateTo('order')" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md">
                        Butuh Bantuan Langsung? Konsultasi dengan Ahli
                    </button>
                </div>
            </div>
        </div>
    `;
}

// About Page
function renderAboutPage() {
    return `
        <div class="min-h-screen py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Hero Section -->
                <div class="text-center mb-16">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">
                        Tentang <span class="text-green-600">Tejoss</span>
                    </h1>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Kami adalah platform jasa pertanian terdepan yang berkomitmen untuk memodernisasi 
                        sektor pertanian Indonesia melalui teknologi dan layanan berkualitas tinggi.
                    </p>
                </div>

                <!-- Vision Mission -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div class="card p-8 text-center">
                        <i data-lucide="eye" class="h-12 w-12 text-green-600 mx-auto mb-4"></i>
                        <h3 class="text-2xl font-bold mb-4">Visi Kami</h3>
                        <p class="text-gray-600">
                            Menjadi platform jasa pertanian terdepan di Indonesia yang memberdayakan 
                            petani dengan teknologi modern dan layanan berkualitas tinggi.
                        </p>
                    </div>

                    <div class="card p-8 text-center">
                        <i data-lucide="target" class="h-12 w-12 text-green-600 mx-auto mb-4"></i>
                        <h3 class="text-2xl font-bold mb-4">Misi Kami</h3>
                        <p class="text-gray-600">
                            Memberikan akses mudah, transparan, dan terjangkau terhadap layanan pertanian 
                            modern untuk meningkatkan produktivitas dan kesejahteraan petani Indonesia.
                        </p>
                    </div>
                </div>

                <!-- Values -->
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900 mb-8">Nilai-Nilai Kami</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="text-center">
                            <i data-lucide="award" class="h-12 w-12 text-green-600 mx-auto mb-4"></i>
                            <h3 class="font-semibold mb-2">Transparansi</h3>
                            <p class="text-gray-600 text-sm">Harga jelas, layanan transparan, tanpa biaya tersembunyi</p>
                        </div>
                        <div class="text-center">
                            <i data-lucide="users" class="h-12 w-12 text-green-600 mx-auto mb-4"></i>
                            <h3 class="font-semibold mb-2">Profesionalisme</h3>
                            <p class="text-gray-600 text-sm">Layanan berkualitas tinggi dengan standar internasional</p>
                        </div>
                        <div class="text-center">
                            <i data-lucide="building-2" class="h-12 w-12 text-green-600 mx-auto mb-4"></i>
                            <h3 class="font-semibold mb-2">Keberlanjutan</h3>
                            <p class="text-gray-600 text-sm">Mendukung pertanian berkelanjutan untuk masa depan</p>
                        </div>
                    </div>
                </div>

                <!-- Contact Section -->
                <div class="bg-green-50 rounded-lg p-8 text-center">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
                    <p class="text-gray-600 mb-8">Tim customer service kami siap membantu Anda 24/7</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="flex items-center justify-center gap-3">
                            <i data-lucide="phone" class="h-5 w-5 text-green-600"></i>
                            <span>+62 812-3456-7890</span>
                        </div>
                        <div class="flex items-center justify-center gap-3">
                            <i data-lucide="mail" class="h-5 w-5 text-green-600"></i>
                            <span>info@tejoss.id</span>
                        </div>
                        <div class="flex items-center justify-center gap-3">
                            <i data-lucide="map-pin" class="h-5 w-5 text-green-600"></i>
                            <span>Jakarta, Indonesia</span>
                        </div>
                    </div>

                    <button onclick="navigateTo('order')" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md">
                        Mulai Gunakan Layanan Kami
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Export functions
window.renderHomePage = renderHomePage;
window.renderServicesPage = renderServicesPage;
window.renderTestimonialsPage = renderTestimonialsPage;
window.renderEducationPage = renderEducationPage;
window.renderAboutPage = renderAboutPage;
window.showTab = showTab;
window.handleB2BForm = handleB2BForm;