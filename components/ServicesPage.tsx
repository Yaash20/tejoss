import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  Wheat, 
  Settings, 
  Truck, 
  Cog, 
  Tractor, 
  Users, 
  CheckCircle, 
  Star,
  Clock,
  Shield,
  TrendingUp,
  Building,
  Handshake,
  DollarSign,
  Target,
  Play,
  BookOpen
} from 'lucide-react'

interface ServicesPageProps {
  setActiveSection: (section: string) => void
  onServiceSelect?: (service: any, packageData?: any) => void
}

export function ServicesPage({ setActiveSection, onServiceSelect }: ServicesPageProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    companyType: '',
    farmSize: '',
    location: '',
    services: [] as string[],
    message: ''
  })

  const mainServices = [
    {
      icon: <Wheat className="h-8 w-8 text-green-600" />,
      title: "Jasa Panen",
      description: "Layanan panen dengan peralatan modern dan tenaga kerja berpengalaman",
      basePrice: "Rp 150.000/Ha",
      features: ["Peralatan modern", "Tenaga kerja terlatih", "Panen cepat & bersih", "Garansi kualitas"],
      popular: true
    },
    {
      icon: <Settings className="h-8 w-8 text-green-600" />,
      title: "Jasa Tanam",
      description: "Penanaman bibit dengan teknik terbaik untuk hasil optimal",
      basePrice: "Rp 200.000/Ha",
      features: ["Teknik penanaman modern", "Bibit berkualitas", "Jadwal optimal", "Monitoring pertumbuhan"]
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: "Jasa Angkut",
      description: "Transportasi hasil panen ke tempat tujuan dengan aman",
      basePrice: "Rp 50.000/ton",
      features: ["Kendaraan khusus", "Pengiriman aman", "Tracking real-time", "Asuransi barang"]
    },
    {
      icon: <Cog className="h-8 w-8 text-green-600" />,
      title: "Jasa Giling",
      description: "Penggilingan gabah/jagung dengan mesin modern",
      basePrice: "Rp 100.000/ton",
      features: ["Mesin modern", "Hasil berkualitas", "Proses cepat", "Kemasan rapi"]
    },
    {
      icon: <Tractor className="h-8 w-8 text-green-600" />,
      title: "Sewa Traktor",
      description: "Penyewaan traktor dan alat pertanian modern",
      basePrice: "Rp 300.000/hari",
      features: ["Traktor modern", "Operator berpengalaman", "Bahan bakar include", "Maintenance terjamin"]
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Tenaga Kerja",
      description: "Penyediaan tenaga kerja pertanian terlatih",
      basePrice: "Rp 100.000/orang/hari",
      features: ["Pekerja terlatih", "Pengalaman luas", "Asuransi kerja", "Supervisi ketat"]
    }
  ]

  const subscriptionPackages = [
    {
      name: "Paket Starter",
      price: "Rp 2.500.000",
      period: "/bulan",
      description: "Untuk petani pemula atau lahan kecil",
      features: [
        "2x layanan panen per bulan",
        "1x layanan tanam per bulan", 
        "Konsultasi gratis",
        "Diskon 10% untuk layanan tambahan",
        "Priority booking"
      ],
      recommended: false
    },
    {
      name: "Paket Professional",
      price: "Rp 4.500.000",
      period: "/bulan",
      description: "Untuk petani berpengalaman dengan lahan sedang",
      features: [
        "4x layanan panen per bulan",
        "3x layanan tanam per bulan",
        "2x layanan angkut per bulan",
        "Konsultasi unlimited",
        "Diskon 15% untuk layanan tambahan",
        "Priority booking + fast response",
        "Laporan bulanan"
      ],
      recommended: true
    },
    {
      name: "Paket Enterprise",
      price: "Rp 8.000.000",
      period: "/bulan",
      description: "Untuk petani skala besar atau korporasi",
      features: [
        "Unlimited layanan panen",
        "Unlimited layanan tanam",
        "Unlimited layanan angkut",
        "Dedicated account manager",
        "Diskon 25% untuk layanan tambahan",
        "Priority booking + same day response",
        "Laporan real-time",
        "Custom solution",
        "Training team"
      ],
      recommended: false
    }
  ]

  const premiumServices = [
    {
      title: "Konsultasi Ahli Pertanian",
      description: "Konsultasi dengan ahli pertanian berpengalaman",
      price: "Rp 500.000/sesi"
    },
    {
      title: "Soil Testing & Analysis",
      description: "Analisis tanah komprehensif untuk optimasi hasil",
      price: "Rp 750.000/lokasi"
    },
    {
      title: "Pest Control Management",
      description: "Pengendalian hama terpadu dengan teknologi modern",
      price: "Rp 300.000/Ha"
    },
    {
      title: "Irrigation System Setup",
      description: "Instalasi sistem irigasi modern dan efisien",
      price: "Mulai Rp 5.000.000"
    }
  ]

  // Data untuk petani
  const farmerBenefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: "Hemat Biaya Operasional",
      description: "Hemat hingga 40% biaya operasional dibanding sistem konvensional",
      details: ["Tidak perlu investasi alat mahal", "Biaya maintenance ditanggung kami", "Harga transparan tanpa markup"]
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Efisiensi Waktu",
      description: "Percepat proses pertanian dengan teknologi modern",
      details: ["Panen 3x lebih cepat", "Penanaman lebih presisi", "Jadwal fleksibel sesuai kebutuhan"]
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Tingkatkan Produktivitas",
      description: "Hasil panen lebih optimal dengan teknologi tepat guna",
      details: ["Tingkatkan hasil panen hingga 25%", "Mengurangi loss/kerusakan", "Kualitas hasil lebih baik"]
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Mitigasi Risiko",
      description: "Kurangi risiko kegagalan dengan dukungan ahli",
      details: ["Konsultasi gratis dengan ahli", "Monitoring berkala", "Garansi kualitas layanan"]
    }
  ]

  const comparisonData = [
    {
      aspect: "Biaya Investasi Awal",
      conventional: "Rp 50-100 juta (alat & mesin)",
      tejoss: "Rp 0 (pay per use)",
      savings: "100%"
    },
    {
      aspect: "Waktu Panen (1 Ha)",
      conventional: "5-7 hari",
      tejoss: "1-2 hari",
      savings: "70%"
    },
    {
      aspect: "Tenaga Kerja (1 Ha)",
      conventional: "15-20 orang",
      tejoss: "5-8 orang",
      savings: "60%"
    },
    {
      aspect: "Biaya Maintenance",
      conventional: "Rp 5-10 juta/tahun",
      tejoss: "Rp 0",
      savings: "100%"
    }
  ]

  const farmerTestimonials = [
    {
      name: "Pak Sumarno",
      location: "Petani Padi, Subang",
      farm: "Lahan 2 Ha",
      quote: "Sejak pakai Tejoss, biaya operasional saya turun drastis. Tidak perlu beli traktor mahal, cukup sewa saat butuh. Hasilnya malah lebih bagus!",
      beforeAfter: {
        before: "Biaya Rp 8 juta/musim",
        after: "Biaya Rp 4.5 juta/musim"
      },
      rating: 5
    },
    {
      name: "Ibu Kartini",
      location: "Petani Jagung, Lampung",
      farm: "Lahan 1.5 Ha",
      quote: "Dulunya panen jagung butuh 2 minggu, sekarang cuma 3 hari! Tim Tejoss profesional banget, hasilnya juga lebih bersih.",
      beforeAfter: {
        before: "Panen 14 hari",
        after: "Panen 3 hari"
      },
      rating: 5
    },
    {
      name: "Pak Ahmad",
      location: "Petani Kedelai, Solo",
      farm: "Lahan 3 Ha",
      quote: "Yang paling saya suka itu transparansi harganya. Jelas dari awal berapa biayanya, tidak ada tambahan-tambahan. Pelayanannya juga bagus.",
      beforeAfter: {
        before: "Hasil 2.5 ton/Ha",
        after: "Hasil 3.2 ton/Ha"
      },
      rating: 5
    }
  ]

  // Data untuk B2B
  const b2bServices = [
    {
      title: "Manajemen Lahan Korporasi",
      description: "Pengelolaan lahan pertanian skala besar dengan teknologi modern",
      features: ["Manajemen end-to-end", "Teknologi precision farming", "Monitoring real-time", "Laporan berkala"],
      minSize: "50 Ha",
      price: "Negosiasi"
    },
    {
      title: "Kemitraan Koperasi",
      description: "Program khusus untuk koperasi dan kelompok tani",
      features: ["Paket bundling service", "Training anggota", "Diskon volume", "Support berkelanjutan"],
      minSize: "20 Ha total",
      price: "Diskon hingga 30%"
    },
    {
      title: "Contract Farming",
      description: "Kerjasama kontrak jangka panjang dengan garansi kualitas",
      features: ["Kontrak eksklusif", "Garansi hasil", "Pembayaran fleksibel", "Quality assurance"],
      minSize: "100 Ha",
      price: "Fixed rate per kontrak"
    }
  ]

  const partnerBenefits = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Efisiensi Operasional",
      description: "Tingkatkan efisiensi hingga 40% dengan manajemen terintegrasi"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Manajemen Risiko",
      description: "Mitigasi risiko operasional dengan teknologi dan expertise kami"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Dedicated Support",
      description: "Tim khusus yang menangani kebutuhan partner korporasi"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Fleksibilitas Jadwal",
      description: "Penjadwalan prioritas sesuai timeline bisnis Anda"
    }
  ]

  const partnerLogos = [
    { name: "Koperasi Tani Sejahtera", type: "Koperasi" },
    { name: "PT Agro Nusantara", type: "Korporasi" },
    { name: "Kelompok Tani Makmur", type: "Kelompok Tani" },
    { name: "CV Berkah Pertanian", type: "Perusahaan" }
  ]

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        services: [...formData.services, service]
      })
    } else {
      setFormData({
        ...formData,
        services: formData.services.filter(s => s !== service)
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Terima kasih! Tim B2B kami akan menghubungi Anda dalam 24 jam.')
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Layanan Jasa Pertanian Lengkap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solusi one-stop untuk semua kebutuhan pertanian Anda dengan harga transparan dan kualitas terjamin
          </p>
        </div>

        {/* Service Tabs */}
        <Tabs defaultValue="services" className="mb-16">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="services">Layanan Utama</TabsTrigger>
            <TabsTrigger value="subscription">Paket Langganan</TabsTrigger>
            <TabsTrigger value="premium">Layanan Premium</TabsTrigger>
            <TabsTrigger value="farmers">Untuk Petani</TabsTrigger>
            <TabsTrigger value="b2b">Kemitraan B2B</TabsTrigger>
          </TabsList>

          {/* Main Services */}
          <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {mainServices.map((service, index) => (
                <Card key={index} className={`relative hover:shadow-xl transition-shadow ${service.popular ? 'ring-2 ring-green-500' : ''}`}>
                  {service.popular && (
                    <Badge className="absolute -top-2 left-4 bg-green-500 text-white">
                      Paling Populer
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      {service.icon}
                      <CardTitle>{service.title}</CardTitle>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-green-600">{service.basePrice}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => {
                        if (onServiceSelect) {
                          const serviceData = {
                            id: service.title.toLowerCase().replace(/\s+/g, '_'),
                            name: service.title,
                            price: parseInt(service.basePrice.replace(/[^\d]/g, '')),
                            unit: service.basePrice.includes('/Ha') ? 'Ha' : service.basePrice.includes('/ton') ? 'ton' : service.basePrice.includes('/hari') ? 'hari' : service.basePrice.includes('/orang') ? 'orang/hari' : 'unit',
                            description: service.description,
                            category: 'main_service'
                          }
                          onServiceSelect(serviceData)
                        } else {
                          setActiveSection('order')
                        }
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Pesan Sekarang
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subscription Packages */}
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {subscriptionPackages.map((pkg, index) => (
                <Card key={index} className={`relative hover:shadow-xl transition-shadow ${pkg.recommended ? 'ring-2 ring-green-500' : ''}`}>
                  {pkg.recommended && (
                    <Badge className="absolute -top-2 left-4 bg-green-500 text-white">
                      Rekomendasi
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-green-600">
                      {pkg.price}
                      <span className="text-base text-gray-500">{pkg.period}</span>
                    </div>
                    <p className="text-gray-600">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => {
                        if (onServiceSelect) {
                          const packageData = {
                            id: pkg.name.toLowerCase().replace(/\s+/g, '_'),
                            name: pkg.name,
                            price: parseInt(pkg.price.replace(/[^\d]/g, '')),
                            discount: pkg.name === 'Paket Starter' ? 0.1 : pkg.name === 'Paket Professional' ? 0.15 : 0.25
                          }
                          // Use a default service for package
                          const serviceData = {
                            id: 'package_service',
                            name: 'Layanan Paket Langganan',
                            price: 150000,
                            unit: 'Ha',
                            description: 'Layanan pertanian dengan paket langganan',
                            category: 'subscription_package'
                          }
                          onServiceSelect(serviceData, packageData)
                        } else {
                          setActiveSection('order')
                        }
                      }}
                      className={`w-full ${pkg.recommended ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    >
                      Pilih Paket
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Premium Services */}
          <TabsContent value="premium">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {premiumServices.map((service, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      {service.title}
                    </CardTitle>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600">{service.price}</span>
                      <Button 
                        onClick={() => {
                          if (onServiceSelect) {
                            const serviceData = {
                              id: service.title.toLowerCase().replace(/\s+/g, '_'),
                              name: service.title,
                              price: parseInt(service.price.replace(/[^\d]/g, '')),
                              unit: service.price.includes('/sesi') ? 'sesi' : service.price.includes('/lokasi') ? 'lokasi' : service.price.includes('/Ha') ? 'Ha' : 'unit',
                              description: service.description,
                              category: 'premium_service'
                            }
                            onServiceSelect(serviceData)
                          } else {
                            setActiveSection('order')
                          }
                        }}
                        variant="outline" 
                        className="border-green-600 text-green-600 hover:bg-green-50"
                      >
                        Pesan Sekarang
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Untuk Petani Tab */}
          <TabsContent value="farmers">
            {/* Hero Section for Farmers */}
            <section className="text-center mb-16">
              <Badge className="bg-green-100 text-green-800 px-4 py-2 mb-4">
                Khusus untuk Petani Indonesia
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tingkatkan Produktivitas <br />
                <span className="text-green-600">Pertanian Anda</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Jadilah bagian dari revolusi pertanian modern. Dengan Tejoss, petani skala kecil-menengah 
                dapat mengakses teknologi canggih tanpa investasi besar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  onClick={() => setActiveSection('order')}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                >
                  Mulai Gratis Sekarang
                </Button>
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
                >
                  Konsultasi Gratis
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                💡 Konsultasi gratis + estimasi harga tanpa komitmen
              </div>
            </section>

            {/* Benefits for Farmers */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Keuntungan Menggunakan Jasa Tejoss
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Bandingkan dengan sistem konvensional dan rasakan perbedaannya
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {farmerBenefits.map((benefit, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-center">
                        <div className="p-3 bg-green-50 rounded-full">
                          {benefit.icon}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{benefit.description}</p>
                      <ul className="text-xs text-left space-y-1">
                        {benefit.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Comparison Table */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Perbandingan: Konvensional vs Tejoss
                </h3>
                <p className="text-xl text-gray-600">
                  Lihat berapa banyak yang bisa Anda hemat dengan menggunakan layanan kami
                </p>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Aspek</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Cara Konvensional</th>
                        <th className="px-6 py-4 text-left font-semibold text-green-600">Dengan Tejoss</th>
                        <th className="px-6 py-4 text-left font-semibold text-green-600">Penghematan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-6 py-4 font-medium">{item.aspect}</td>
                          <td className="px-6 py-4 text-gray-600">{item.conventional}</td>
                          <td className="px-6 py-4 text-green-600 font-medium">{item.tejoss}</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-green-100 text-green-800">
                              -{item.savings}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            {/* Farmer Testimonials */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Kisah Sukses Petani Tejoss
                </h3>
                <p className="text-xl text-gray-600">
                  Dengar langsung dari petani yang sudah merasakan manfaatnya
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {farmerTestimonials.map((testimonial, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Sebelum:</span>
                            <p className="font-medium text-red-600">{testimonial.beforeAfter.before}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Setelah:</span>
                            <p className="font-medium text-green-600">{testimonial.beforeAfter.after}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                        <p className="text-sm text-green-600">{testimonial.farm}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Kemitraan B2B Tab */}
          <TabsContent value="b2b">
            {/* B2B Hero Section */}
            <section className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 mb-4">
                Solusi B2B Pertanian
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-green-600">Kemitraan</span> <br />
                untuk Bisnis Pertanian
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Bergabunglah dengan korporasi, koperasi, dan kelompok tani terkemuka yang telah 
                mempercayakan kebutuhan pertanian mereka kepada Tejoss.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4">
                  Konsultasi B2B
                </Button>
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4">
                  Download Proposal
                </Button>
              </div>
            </section>

            {/* B2B Services */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Paket Layanan B2B
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Solusi khusus untuk kebutuhan bisnis pertanian skala besar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {b2bServices.map((service, index) => (
                  <Card key={index} className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-green-600" />
                        {service.title}
                      </CardTitle>
                      <p className="text-gray-600">{service.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Minimal:</span>
                            <span className="font-medium">{service.minSize}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Harga:</span>
                            <span className="font-medium text-green-600">{service.price}</span>
                          </div>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Konsultasi Paket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Partner Benefits */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Keuntungan Bermitra dengan Tejoss
                </h3>
                <p className="text-xl text-gray-600">
                  Raih keunggulan kompetitif dengan solusi pertanian terintegrasi
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {partnerBenefits.map((benefit, index) => (
                  <Card key={index} className="text-center p-6">
                    <CardContent className="p-0">
                      <div className="mb-4 flex justify-center">
                        <div className="p-3 bg-green-50 rounded-full">
                          {benefit.icon}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Existing Partners */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Partner Terpercaya
                </h3>
                <p className="text-xl text-gray-600">
                  Bergabung dengan partner yang telah merasakan manfaat kerjasama dengan Tejoss
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {partnerLogos.map((partner, index) => (
                    <Card key={index} className="bg-white text-center p-6">
                      <CardContent className="p-0">
                        <div className="h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                          <Building className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{partner.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {partner.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Partnership Form */}
            <section className="mb-16">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">
                      Form Pengajuan Kemitraan
                    </CardTitle>
                    <p className="text-center text-gray-600">
                      Isi form di bawah ini untuk memulai diskusi kemitraan strategis
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Nama Perusahaan/Koperasi *</Label>
                          <Input
                            placeholder="PT/CV/Koperasi..."
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label>Nama Contact Person *</Label>
                          <Input
                            placeholder="Nama lengkap"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            placeholder="email@perusahaan.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label>No. Telepon *</Label>
                          <Input
                            placeholder="+62 xxx xxx xxxx"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label>Jenis Perusahaan *</Label>
                          <Select value={formData.companyType} onValueChange={(value) => setFormData({...formData, companyType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="korporasi">Korporasi</SelectItem>
                              <SelectItem value="koperasi">Koperasi</SelectItem>
                              <SelectItem value="kelompok-tani">Kelompok Tani</SelectItem>
                              <SelectItem value="perusahaan-perkebunan">Perusahaan Perkebunan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Total Luas Lahan *</Label>
                          <Input
                            placeholder="dalam Ha"
                            value={formData.farmSize}
                            onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label>Lokasi Utama *</Label>
                          <Input
                            placeholder="Kota/Kabupaten"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Layanan yang Diminati</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {['Manajemen Lahan', 'Contract Farming', 'Sewa Alat Berat', 'Konsultasi Ahli', 'Training & Development', 'Quality Control'].map(service => (
                            <label key={service} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                onChange={(e) => handleServiceChange(service, e.target.checked)}
                              />
                              <span className="text-sm">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Pesan/Kebutuhan Khusus</Label>
                        <Textarea
                          placeholder="Jelaskan kebutuhan spesifik dan tujuan kemitraan..."
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          rows={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4"
                      >
                        <Handshake className="h-5 w-5 mr-2" />
                        Kirim Pengajuan Kemitraan
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Why Choose Us */}
        <section className="bg-green-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Mengapa Memilih Layanan Tejoss?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Transparansi Harga</h3>
              <p className="text-gray-600 text-sm">Harga jelas tanpa biaya tersembunyi. Apa yang Anda lihat adalah apa yang Anda bayar.</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Kualitas Terjamin</h3>
              <p className="text-gray-600 text-sm">Standar kualitas tinggi dengan garansi kepuasan dan layanan after-sales.</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Layanan Cepat</h3>
              <p className="text-gray-600 text-sm">Response time cepat dengan jadwal fleksibel sesuai kebutuhan Anda.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Siap Meningkatkan Efisiensi Pertanian Anda?
          </h2>
          <p className="text-gray-600 mb-8">
            Konsultasikan kebutuhan pertanian Anda dengan tim ahli kami
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setActiveSection('order')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Pesan Layanan
            </Button>
            <Button 
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
            >
              Konsultasi Gratis
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}