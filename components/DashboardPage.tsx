import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  Eye,
  Plus,
  TrendingUp,
  DollarSign,
  BarChart3
} from 'lucide-react'

interface DashboardPageProps {
  setActiveSection: (section: string) => void
}

export function DashboardPage({ setActiveSection }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in real app this would come from API
  const userProfile = {
    name: "Pak Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "+62 812-3456-7890",
    location: "Karawang, Jawa Barat",
    memberSince: "Januari 2024",
    totalOrders: 12,
    totalSpent: 15750000,
    farmSize: "3.5 Ha"
  }

  const currentOrders = [
    {
      id: "TJS-2024-001",
      service: "Jasa Panen",
      location: "Lahan A - Karawang",
      date: "2024-12-28",
      status: "in-progress",
      progress: 60,
      estimatedCompletion: "2024-12-29",
      worker: "Tim Alpha",
      cost: 525000
    },
    {
      id: "TJS-2024-002", 
      service: "Jasa Tanam",
      location: "Lahan B - Karawang",
      date: "2024-12-30",
      status: "scheduled",
      progress: 0,
      estimatedCompletion: "2025-01-02",
      worker: "Tim Beta",
      cost: 700000
    }
  ]

  const orderHistory = [
    {
      id: "TJS-2024-003",
      service: "Jasa Panen",
      location: "Lahan A - Karawang",
      date: "2024-12-15",
      completedDate: "2024-12-16",
      status: "completed",
      cost: 525000,
      rating: 5,
      feedback: "Sangat puas dengan pelayanan. Tim kerja profesional dan hasil panen bagus."
    },
    {
      id: "TJS-2024-004",
      service: "Sewa Traktor",
      location: "Lahan C - Karawang", 
      date: "2024-12-10",
      completedDate: "2024-12-12",
      status: "completed",
      cost: 900000,
      rating: 5,
      feedback: "Traktor dalam kondisi prima, operator berpengalaman."
    },
    {
      id: "TJS-2024-005",
      service: "Jasa Angkut",
      location: "Lahan A - Karawang",
      date: "2024-11-28",
      completedDate: "2024-11-28",
      status: "completed",
      cost: 300000,
      rating: 4,
      feedback: "Pengiriman tepat waktu, barang aman sampai tujuan."
    }
  ]

  const statistics = {
    totalSavings: 6200000,
    productivityIncrease: 28,
    timeEfficiency: 65,
    serviceRating: 4.8
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai'
      case 'in-progress': return 'Sedang Dikerjakan'
      case 'scheduled': return 'Terjadwal'
      case 'cancelled': return 'Dibatalkan'
      default: return status
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Selamat datang kembali, {userProfile.name}</p>
          </div>
          <Button 
            onClick={() => setActiveSection('order')}
            className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Pesan Layanan Baru
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="current">Pesanan Aktif</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
                      <p className="text-2xl font-bold text-gray-900">{userProfile.totalOrders}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
                      <p className="text-2xl font-bold text-gray-900">
                        Rp {(userProfile.totalSpent / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Penghematan</p>
                      <p className="text-2xl font-bold text-green-600">
                        Rp {(statistics.totalSavings / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rating Layanan</p>
                      <div className="flex items-center gap-1">
                        <p className="text-2xl font-bold text-gray-900">{statistics.serviceRating}</p>
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    <Star className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Peningkatan Produktivitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Peningkatan Hasil Panen</span>
                        <span>{statistics.productivityIncrease}%</span>
                      </div>
                      <Progress value={statistics.productivityIncrease} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Efisiensi Waktu</span>
                        <span>{statistics.timeEfficiency}%</span>
                      </div>
                      <Progress value={statistics.timeEfficiency} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pesanan Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{order.service}</p>
                          <p className="text-xs text-gray-500">{order.location}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Current Orders Tab */}
          <TabsContent value="current" className="space-y-6">
            {currentOrders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{order.service}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{order.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{order.location}</span>
                        </div>
                      </div>

                      {order.status === 'in-progress' && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress Pengerjaan</span>
                            <span>{order.progress}%</span>
                          </div>
                          <Progress value={order.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Estimasi Selesai</p>
                          <p className="font-medium">{order.estimatedCompletion}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Biaya</p>
                          <p className="font-medium text-green-600">
                            Rp {order.cost.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-2" />
                          Tracking
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Belum ada pesanan aktif</p>
                  <Button onClick={() => setActiveSection('order')}>
                    Pesan Layanan Sekarang
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">{order.service}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{order.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Selesai: {order.completedDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Rp {order.cost.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                        
                        {order.rating && (
                          <div className="mb-2">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">({order.rating}/5)</span>
                            </div>
                            {order.feedback && (
                              <p className="text-sm text-gray-600 italic">"{order.feedback}"</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
                      <p className="mt-1 text-gray-900">{userProfile.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 text-gray-900">{userProfile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">No. Telepon</label>
                      <p className="mt-1 text-gray-900">{userProfile.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lokasi</label>
                      <p className="mt-1 text-gray-900">{userProfile.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Luas Lahan</label>
                      <p className="mt-1 text-gray-900">{userProfile.farmSize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Member Sejak</label>
                      <p className="mt-1 text-gray-900">{userProfile.memberSince}</p>
                    </div>
                  </div>
                  <Button className="mt-6">Edit Profil</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Akun</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg bg-green-100 text-green-600">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{userProfile.name}</h3>
                    <p className="text-sm text-gray-600">Member Premium</p>
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Pesanan</span>
                      <span className="font-medium">{userProfile.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rating Rata-rata</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{statistics.serviceRating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Penghematan</span>
                      <span className="font-medium text-green-600">
                        Rp {(statistics.totalSavings / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}