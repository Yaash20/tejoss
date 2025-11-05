import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Shield, 
  Target,
  Lightbulb,
  BookOpen,
  Star,
  Play
} from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface FarmersPageProps {
  setActiveSection: (section: string) => void
}

export function FarmersPage({ setActiveSection }: FarmersPageProps) {
  const benefits = [
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

  const testimonials = [
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

  const educationContent = [
    {
      title: "Cara Meningkatkan Hasil Panen",
      description: "Teknik-teknik modern untuk optimasi produktivitas lahan",
      duration: "15 menit",
      type: "Video"
    },
    {
      title: "Manajemen Keuangan Pertanian",
      description: "Tips mengelola cash flow dan merencanakan budget pertanian",
      duration: "10 menit",
      type: "Artikel"
    },
    {
      title: "Pemilihan Bibit Unggul",
      description: "Panduan memilih bibit berkualitas untuk hasil optimal",
      duration: "12 menit",
      type: "Video"
    },
    {
      title: "Teknologi Pertanian Modern",
      description: "Pengenalan alat dan teknologi terbaru di bidang pertanian",
      duration: "20 menit",
      type: "Webinar"
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 px-4 py-2 mb-4">
            Khusus untuk Petani Indonesia
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tingkatkan Produktivitas <br />
            <span className="text-green-600">Pertanian Anda</span>
          </h1>
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

        {/* Benefits Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Keuntungan Menggunakan Jasa Tejoss
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bandingkan dengan sistem konvensional dan rasakan perbedaannya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-green-50 rounded-full">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perbandingan: Konvensional vs Tejoss
            </h2>
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

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kisah Sukses Petani Tejoss
            </h2>
            <p className="text-xl text-gray-600">
              Dengar langsung dari petani yang sudah merasakan manfaatnya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
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

        {/* Education Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Edukasi Pertanian Gratis
            </h2>
            <p className="text-xl text-gray-600">
              Tingkatkan pengetahuan pertanian Anda dengan konten edukatif dari ahli
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {educationContent.map((content, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {content.type === 'Video' && <Play className="h-4 w-4 text-green-600" />}
                    {content.type === 'Artikel' && <BookOpen className="h-4 w-4 text-green-600" />}
                    {content.type === 'Webinar' && <Users className="h-4 w-4 text-green-600" />}
                    <Badge variant="outline" className="text-xs">
                      {content.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{content.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{content.duration}</span>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                      Akses Gratis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => setActiveSection('education')}
              className="bg-green-600 hover:bg-green-700"
            >
              Lihat Semua Konten Edukasi
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Siap Bergabung dengan Revolusi Pertanian?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Ribuan petani sudah merasakan manfaatnya. Saatnya Anda bergabung dan 
            rasakan perbedaan nyata dalam produktivitas dan efisiensi pertanian Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setActiveSection('order')}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Mulai Sekarang
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-green-700 px-8 py-4 text-lg"
            >
              Hubungi Tim Ahli
            </Button>
          </div>
          <div className="mt-6 text-green-100 text-sm">
            💡 Gratis konsultasi awal + estimasi tanpa komitmen
          </div>
        </section>
      </div>
    </div>
  )
}