import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  Users,
  Shield,
  Clock,
  Star,
  Truck,
  Wheat,
  Settings,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  setActiveSection: (section: string) => void;
}

export function HomePage({ setActiveSection }: HomePageProps) {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Transparansi Harga",
      description:
        "Harga jelas dan transparan tanpa biaya tersembunyi",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Standar Kualitas",
      description:
        "Layanan berkualitas tinggi dengan pekerja berpengalaman",
    },
    {
      icon: <Clock className="h-6 w-6 text-green-600" />,
      title: "Layanan 24/7",
      description:
        "Siap melayani kebutuhan pertanian Anda kapan saja",
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Tim Profesional",
      description: "Tenaga kerja terlatih dan peralatan modern",
    },
  ];

  const services = [
    {
      icon: <Wheat className="h-8 w-8 text-green-600" />,
      title: "Jasa Panen",
      description:
        "Panen hasil tani dengan peralatan modern dan efisien",
      price: "Mulai Rp 150.000/Ha",
    },
    {
      icon: <Settings className="h-8 w-8 text-green-600" />,
      title: "Jasa Tanam",
      description:
        "Penanaman bibit dengan teknik terbaik untuk hasil optimal",
      price: "Mulai Rp 200.000/Ha",
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: "Jasa Angkut",
      description:
        "Transportasi hasil panen ke tempat tujuan dengan aman",
      price: "Mulai Rp 50.000/ton",
    },
  ];

  const testimonials = [
    {
      name: "Pak Budi Santoso",
      location: "Petani Padi, Karawang",
      text: "Tejoss sangat membantu saat musim panen. Pekerja profesional dan harga transparan. Hasil panen jadi lebih maksimal!",
      rating: 5,
    },
    {
      name: "Ibu Sari Dewi",
      location: "Petani Jagung, Lampung",
      text: "Pertama kali pakai jasa Tejoss langsung puas. Pelayanan cepat, harga sesuai, dan hasilnya memuaskan.",
      rating: 5,
    },
    {
      name: "Pak Ahmad Fauzi",
      location: "Kelompok Tani Makmur",
      text: "Kerjasama dengan Tejoss sudah 2 tahun. Selalu on-time dan kualitas kerja tidak pernah mengecewakan.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566956884055-5034d746e52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBmaWVsZCUyMGFncmljdWx0dXJlJTIwaW5kb25lc2lhfGVufDF8fHx8MTc1Njk5MDMyMXww&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Badge className="bg-green-100 text-green-800 px-4 py-2 mb-4">
                #1 Platform Jasa Pertanian Indonesia
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Solusi{" "}
              <span className="text-green-600">One-Stop</span>
              <br />
              Jasa Pertanian Modern
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Dari tanam hingga panen, dari angkut hingga
              giling. Tejoss hadir dengan layanan jasa pertanian
              profesional yang transparan, berkualitas, dan
              terpercaya untuk kesuksesan pertanian Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setActiveSection("order")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
              >
                Pesan Jasa Pertanian Sekarang
              </Button>
              <Button
                onClick={() => setActiveSection("services")}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
              >
                Lihat Layanan
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Gratis Konsultasi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Harga Transparan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Garansi Kualitas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Tejoss?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami berkomitmen memberikan layanan jasa pertanian
              terbaik dengan standar kualitas tinggi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-green-50 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Unggulan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Layanan jasa pertanian lengkap dengan harga yang
              kompetitif dan transparan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-white hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="text-green-600 font-semibold">
                    {service.price}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => setActiveSection("services")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Lihat Semua Layanan
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kata Mereka Tentang Tejoss
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ribuan petani sudah merasakan manfaat layanan jasa
              pertanian kami
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ),
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Meningkatkan Produktivitas Pertanian Anda?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Bergabunglah dengan ribuan petani yang sudah
            merasakan kemudahan dan efisiensi layanan Tejoss
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setActiveSection("order")}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Mulai Pesan Sekarang
            </Button>
            <Button
              onClick={() => setActiveSection("farmers")}
              variant="outline"
              className="border-white text-white hover:bg-green-700 px-8 py-4 text-lg"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}