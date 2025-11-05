import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  Star, 
  Search, 
  Filter, 
  ThumbsUp, 
  MessageCircle, 
  Calendar,
  MapPin,
  User,
  Mail,
  Quote,
  TrendingUp,
  Award,
  Users,
  BarChart3
} from 'lucide-react'

interface TestimonialsPageProps {
  setActiveSection: (section: string) => void
}

export function TestimonialsPage({ setActiveSection }: TestimonialsPageProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterService, setFilterService] = useState('all')
  const [filterRating, setFilterRating] = useState('all')
  const [showReviewForm, setShowReviewForm] = useState(false)

  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    location: '',
    service: '',
    rating: 5,
    title: '',
    content: '',
    farmSize: ''
  })

  // Mock data untuk testimoni
  const testimonials = [
    {
      id: 1,
      name: "Pak Budi Santoso",
      location: "Karawang, Jawa Barat",
      avatar: null,
      service: "Jasa Panen",
      rating: 5,
      date: "2024-12-15",
      title: "Layanan Luar Biasa!",
      content: "Tim Tejoss sangat profesional. Panen padi 2 hektar selesai dalam 1 hari dengan hasil yang sangat memuaskan. Tidak ada gabah yang terbuang, semuanya bersih. Harga juga transparan sesuai estimasi awal.",
      farmSize: "2 Ha",
      helpful: 24,
      verified: true,
      images: []
    },
    {
      id: 2,
      name: "Ibu Sari Dewi",
      location: "Lampung Utara",
      avatar: null,
      service: "Jasa Tanam",
      rating: 5,
      date: "2024-12-10",
      title: "Penanaman Jagung Sempurna",
      content: "Penanaman jagung dengan teknik yang benar dan rapi. Tim datang tepat waktu, peralatan modern, dan hasilnya sekarang pertumbuhan jagung sangat bagus dan seragam. Recommended banget!",
      farmSize: "1.5 Ha",
      helpful: 18,
      verified: true,
      images: []
    },
    {
      id: 3,
      name: "Pak Ahmad Fauzi",
      location: "Indramayu, Jawa Barat",
      avatar: null,
      service: "Sewa Traktor",
      rating: 4,
      date: "2024-12-08",
      title: "Traktor Prima, Operator Berpengalaman",
      content: "Sewa traktor untuk pengolahan lahan. Traktor dalam kondisi prima, operator sangat berpengalaman dan friendly. Hanya saja jadwal agak molor 2 jam dari waktu yang dijanjikan, tapi overall memuaskan.",
      farmSize: "3 Ha",
      helpful: 15,
      verified: true,
      images: []
    },
    {
      id: 4,
      name: "Pak Joko Susilo",
      location: "Brebes, Jawa Tengah",
      avatar: null,
      service: "Jasa Angkut",
      rating: 5,
      date: "2024-12-05",
      title: "Pengiriman Aman dan Cepat",
      content: "Angkut bawang merah 3 ton ke Jakarta. Proses loading cepat, pengiriman aman, barang sampai dalam kondisi baik. Driver juga informatif memberikan update perjalanan via WhatsApp.",
      farmSize: "1 Ha",
      helpful: 21,
      verified: true,
      images: []
    },
    {
      id: 5,
      name: "Ibu Wati Suherman",
      location: "Subang, Jawa Barat",
      avatar: null,
      service: "Jasa Giling",
      rating: 5,
      date: "2024-12-02",
      title: "Kualitas Giling Terbaik",
      content: "Giling padi dengan mesin modern. Hasilnya beras putih bersih, tidak banyak yang pecah. Proses cepat dan higienis. Tim juga membantu pengemasan dengan rapi. Puas sekali!",
      farmSize: "2.5 Ha",
      helpful: 19,
      verified: true,
      images: []
    },
    {
      id: 6,
      name: "Pak Ridwan Kamil",
      location: "Majalengka, Jawa Barat",
      avatar: null,
      service: "Tenaga Kerja",
      rating: 4,
      date: "2024-11-28",
      title: "Pekerja Rajin dan Disiplin",
      content: "Sewa 10 orang untuk panen manual. Semua pekerja datang tepat waktu, rajin, dan hasil kerja memuaskan. Hanya kurang 1 bintang karena ada 1 pekerja yang kurang teliti, tapi overall bagus.",
      farmSize: "4 Ha",
      helpful: 12,
      verified: true,
      images: []
    }
  ]

  const stats = {
    totalReviews: 1247,
    averageRating: 4.8,
    ratingDistribution: {
      5: 78,
      4: 16,
      3: 4,
      2: 1,
      1: 1
    },
    totalCustomers: 3420,
    repeatCustomers: 89
  }

  const services = [
    'Jasa Panen',
    'Jasa Tanam', 
    'Jasa Angkut',
    'Jasa Giling',
    'Sewa Traktor',
    'Tenaga Kerja'
  ]

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesService = filterService === 'all' || testimonial.service === filterService
    const matchesRating = filterRating === 'all' || testimonial.rating === parseInt(filterRating)
    
    return matchesSearch && matchesService && matchesRating
  })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Terima kasih atas ulasan Anda! Setelah diverifikasi, ulasan akan tampil di halaman ini.')
    setShowReviewForm(false)
    setNewReview({
      name: '',
      email: '',
      location: '',
      service: '',
      rating: 5,
      title: '',
      content: '',
      farmSize: ''
    })
  }

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={interactive ? "hover:scale-110 transition-transform" : ""}
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const renderTestimonialCard = (testimonial: typeof testimonials[0]) => (
    <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={testimonial.avatar || ''} />
              <AvatarFallback className="bg-green-100 text-green-600">
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{testimonial.name}</h3>
                {testimonial.verified && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    Terverifikasi
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{testimonial.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(testimonial.date).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {renderStars(testimonial.rating)}
            <Badge variant="outline" className="mt-2">
              {testimonial.service}
            </Badge>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">{testimonial.title}</h4>
          <div className="relative">
            <Quote className="absolute top-0 left-0 h-6 w-6 text-green-200" />
            <p className="text-gray-700 pl-8 italic">{testimonial.content}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Luas Lahan: {testimonial.farmSize}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600">
              <ThumbsUp className="h-4 w-4" />
              <span>{testimonial.helpful}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600">
              <MessageCircle className="h-4 w-4" />
              <span>Balas</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Testimoni & Ulasan Pengguna
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dengar langsung pengalaman petani Indonesia yang telah merasakan manfaat layanan Tejoss
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.averageRating}/5.0</div>
              <p className="text-sm text-gray-600">Rating Rata-rata</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalReviews.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Ulasan</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Pelanggan</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.repeatCustomers}%</div>
              <p className="text-sm text-gray-600">Pelanggan Setia</p>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Distribusi Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]} 
                      className="h-2" 
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <TabsList>
              <TabsTrigger value="all">Semua Ulasan</TabsTrigger>
              <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
              <TabsTrigger value="recent">Terbaru</TabsTrigger>
            </TabsList>

            <div className="flex gap-4">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Tulis Ulasan
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari ulasan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Layanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Layanan</SelectItem>
                {services.map(service => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Rating</SelectItem>
                <SelectItem value="5">5 Bintang</SelectItem>
                <SelectItem value="4">4 Bintang</SelectItem>
                <SelectItem value="3">3 Bintang</SelectItem>
                <SelectItem value="2">2 Bintang</SelectItem>
                <SelectItem value="1">1 Bintang</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter Lainnya
            </Button>
          </div>

          <TabsContent value="all" className="space-y-6">
            {filteredTestimonials.map(renderTestimonialCard)}
          </TabsContent>

          <TabsContent value="verified" className="space-y-6">
            {filteredTestimonials.filter(t => t.verified).map(renderTestimonialCard)}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            {filteredTestimonials.slice(0, 3).map(renderTestimonialCard)}
          </TabsContent>
        </Tabs>

        {/* Review Form Dialog */}
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tulis Ulasan Anda</DialogTitle>
              <DialogDescription>
                Bagikan pengalaman Anda menggunakan layanan Tejoss untuk membantu petani lain membuat keputusan yang tepat.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="review-name">Nama Lengkap *</Label>
                  <Input
                    id="review-name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="review-email">Email *</Label>
                  <Input
                    id="review-email"
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="review-location">Lokasi</Label>
                  <Input
                    id="review-location"
                    value={newReview.location}
                    onChange={(e) => setNewReview({...newReview, location: e.target.value})}
                    placeholder="Kota/Kabupaten"
                  />
                </div>
                <div>
                  <Label htmlFor="review-service">Layanan yang Digunakan *</Label>
                  <Select value={newReview.service} onValueChange={(value) => setNewReview({...newReview, service: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih layanan" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="review-farm">Luas Lahan</Label>
                  <Input
                    id="review-farm"
                    value={newReview.farmSize}
                    onChange={(e) => setNewReview({...newReview, farmSize: e.target.value})}
                    placeholder="contoh: 2 Ha"
                  />
                </div>
              </div>

              <div>
                <Label>Rating *</Label>
                <div className="mt-2">
                  {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
                </div>
              </div>

              <div>
                <Label htmlFor="review-title">Judul Ulasan *</Label>
                <Input
                  id="review-title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  placeholder="Ringkasan pengalaman Anda"
                  required
                />
              </div>

              <div>
                <Label htmlFor="review-content">Isi Ulasan *</Label>
                <Textarea
                  id="review-content"
                  value={newReview.content}
                  onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                  placeholder="Ceritakan pengalaman Anda menggunakan layanan Tejoss..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Kirim Ulasan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}