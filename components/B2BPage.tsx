import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { CheckCircle, Users, Building, Handshake, TrendingUp, Shield, Clock } from 'lucide-react'

interface B2BPageProps {
  setActiveSection: (section: string) => void
}

export function B2BPage({ setActiveSection }: B2BPageProps) {
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
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 mb-4">
            Solusi B2B Pertanian
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-green-600">Kemitraan</span> <br />
            untuk Bisnis Pertanian
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Bergabunglah dengan korporasi, koperasi, dan kelompok tani terkemuka yang telah 
            mempercayakan kebutuhan pertanian mereka kepada Tejoss.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
              Konsultasi B2B
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg">
              Download Proposal
            </Button>
          </div>
        </section>

        {/* B2B Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paket Layanan B2B
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solusi khusus untuk kebutuhan bisnis pertanian skala besar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Keuntungan Bermitra dengan Tejoss
            </h2>
            <p className="text-xl text-gray-600">
              Raih keunggulan kompetitif dengan solusi pertanian terintegrasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerBenefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-green-50 rounded-full">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Existing Partners */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Partner Terpercaya
            </h2>
            <p className="text-xl text-gray-600">
              Bergabung dengan partner yang telah merasakan manfaat kerjasama dengan Tejoss
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
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

        {/* Contact Section */}
        <section className="bg-green-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Kemitraan Strategis?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Tim B2B kami siap membantu merancang solusi pertanian yang sesuai dengan 
            kebutuhan bisnis Anda. Hubungi kami untuk diskusi lebih lanjut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4">
              Hubungi Tim B2B
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-green-700 px-8 py-4">
              Schedule Meeting
            </Button>
          </div>
          <div className="mt-6 text-green-100 text-sm">
            📧 b2b@tejoss.id | 📱 +62 21-1234-5678
          </div>
        </section>
      </div>
    </div>
  )
}