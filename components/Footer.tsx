import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Clock
} from 'lucide-react'
import logoImage from 'figma:asset/397a17fe4b503d4612b82ef199f5287580382756.png'

interface FooterProps {
  setActiveSection: (section: string) => void
}

export function Footer({ setActiveSection }: FooterProps) {
  const quickLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'services', label: 'Layanan' },
    { id: 'testimonials', label: 'Testimoni' },
    { id: 'education', label: 'Edukasi' },
    { id: 'about', label: 'Tentang Kami' }
  ]

  const services = [
    'Jasa Panen',
    'Jasa Tanam', 
    'Jasa Angkut',
    'Jasa Giling',
    'Sewa Traktor',
    'Tenaga Kerja'
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Terima kasih! Anda telah berlangganan newsletter Tejoss.')
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-green-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Dapatkan Tips Pertanian & Update Terbaru
            </h3>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Berlangganan newsletter kami untuk mendapatkan tips pertanian, 
              informasi layanan terbaru, dan penawaran khusus.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <Input
                type="email"
                placeholder="Masukkan email Anda"
                className="bg-white text-gray-900 flex-1"
                required
              />
              <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img 
                  src={logoImage} 
                  alt="Tejoss - Petani Joss" 
                  className="h-12 w-auto mb-4 brightness-0 invert"
                />
                <p className="text-gray-300 mb-4">
                  Solusi one-stop untuk semua kebutuhan jasa pertanian modern. 
                  Transparan, berkualitas, dan terpercaya.
                </p>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-semibold mb-4">Ikuti Kami</h4>
                <div className="flex space-x-4">
                  <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white hover:bg-green-600">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white hover:bg-green-600">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white hover:bg-green-600">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white hover:bg-green-600">
                    <Youtube className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6">Menu Utama</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => setActiveSection(link.id)}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-6">Layanan Kami</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setActiveSection('services')}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-6">Hubungi Kami</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-gray-300">
                      Jl. Pertanian Raya No. 123<br />
                      Jakarta Selatan 12560<br />
                      Indonesia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-gray-300">+62 812-3456-7890</p>
                    <p className="text-gray-300">+62 21-1234-5678</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-gray-300">info@tejoss.id</p>
                    <p className="text-gray-300">support@tejoss.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-gray-300">
                      Senin - Jumat: 08:00 - 17:00<br />
                      Sabtu: 08:00 - 15:00<br />
                      Minggu: Tutup
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Tejoss - Petani Joss. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <button className="text-gray-400 hover:text-white transition-colors">
                Kebijakan Privasi
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Syarat & Ketentuan
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Bantuan
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}