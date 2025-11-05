import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  MapPin, 
  Calendar,
  Search,
  Filter,
  Eye,
  Phone,
  MessageCircle,
  Download,
  AlertCircle,
  Tractor,
  Settings,
  Users,
  User,
  Mail
} from 'lucide-react'
import { toast } from 'sonner'

interface MyOrdersPageProps {
  setActiveSection: (section: string) => void
}

export function MyOrdersPage({ setActiveSection }: MyOrdersPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders()
    
    // Auto-refresh every 10 seconds to catch payment status updates
    const interval = setInterval(() => {
      fetchOrders()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('tejoss_token')
      
      if (!token) {
        toast.error('Silakan login terlebih dahulu')
        setActiveSection('login')
        return
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Transform data to match component structure
        const transformedOrders = data.data.map((order: any) => ({
          id: order.order_number,
          service: order.service_name,
          farmSize: `${order.quantity} ${order.unit}`,
          location: order.location,
          orderDate: order.created_at.split('T')[0],
          serviceDate: order.schedule_date,
          totalPrice: parseFloat(order.total_price),
          status: mapBackendStatus(order.status, order.payment_status),
          paymentStatus: order.payment_status,
          timeline: order.timeline || [],
          teamInfo: {
            leader: 'Tim akan segera ditugaskan',
            phone: '+62 812-3456-7890',
            equipment: ['Akan diinformasikan']
          },
          customerInfo: {
            name: 'User',
            phone: '-',
            email: '-'
          }
        }))
        setOrders(transformedOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Gagal memuat data pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  // Map backend status to frontend status
  const mapBackendStatus = (status: string, paymentStatus: string) => {
    // If payment is not yet completed, show pending
    if (paymentStatus === 'unpaid' || paymentStatus === 'pending') return 'pending'
    
    // If payment is completed, show actual order status
    if (paymentStatus === 'paid') {
      if (status === 'pending') return 'scheduled' // After payment, pending becomes scheduled
      if (status === 'confirmed') return 'scheduled'
      if (status === 'in_progress') return 'in_progress'
      if (status === 'completed') return 'completed'
      if (status === 'cancelled') return 'cancelled'
      return 'scheduled' // Default for paid orders
    }
    
    if (status === 'cancelled') return 'cancelled'
    return 'pending'
  }

  // Original mock data for fallback
  const mockOrders = [
    {
      id: 'TJS-20241201-001',
      service: 'Jasa Panen',
      farmSize: '2.5 Ha',
      location: 'Sawah Baru, Subang, Jawa Barat',
      orderDate: '2024-12-01',
      serviceDate: '2024-12-05',
      totalPrice: 375000,
      status: 'completed',
      timeline: [
        { date: '2024-12-01 09:30', status: 'order_placed', description: 'Pesanan berhasil dibuat' },
        { date: '2024-12-01 10:15', status: 'payment_confirmed', description: 'Pembayaran dikonfirmasi' },
        { date: '2024-12-02 08:00', status: 'scheduled', description: 'Tim telah dijadwalkan' },
        { date: '2024-12-05 06:00', status: 'in_progress', description: 'Tim menuju lokasi' },
        { date: '2024-12-05 07:30', status: 'working', description: 'Pekerjaan sedang berlangsung' },
        { date: '2024-12-05 15:00', status: 'completed', description: 'Pekerjaan selesai' }
      ],
      teamInfo: {
        leader: 'Pak Suryadi',
        phone: '+62 812-3456-7890',
        equipment: ['Combine Harvester', '2 Operator', 'Truk Angkut']
      },
      customerInfo: {
        name: 'Pak Budi Santoso',
        phone: '+62 813-2345-6789',
        email: 'budi.santoso@email.com'
      }
    },
    {
      id: 'TJS-20241203-002',
      service: 'Sewa Traktor',
      farmSize: '1 hari',
      location: 'Desa Makmur, Karawang, Jawa Barat',
      orderDate: '2024-12-03',
      serviceDate: '2024-12-07',
      totalPrice: 300000,
      status: 'in_progress',
      timeline: [
        { date: '2024-12-03 14:20', status: 'order_placed', description: 'Pesanan berhasil dibuat' },
        { date: '2024-12-03 14:45', status: 'payment_confirmed', description: 'Pembayaran dikonfirmasi' },
        { date: '2024-12-04 09:00', status: 'scheduled', description: 'Traktor dan operator siap' },
        { date: '2024-12-07 06:30', status: 'in_progress', description: 'Traktor dalam perjalanan ke lokasi' }
      ],
      teamInfo: {
        leader: 'Pak Budi',
        phone: '+62 813-9876-5432',
        equipment: ['Traktor 75 HP', '1 Operator', 'Bajak + Garu']
      },
      customerInfo: {
        name: 'Ibu Sari Dewi',
        phone: '+62 814-3456-7890',
        email: 'sari.dewi@email.com'
      }
    },
    {
      id: 'TJS-20241204-003',
      service: 'Jasa Tanam',
      farmSize: '1.5 Ha',
      location: 'Cipanas, Cianjur, Jawa Barat',
      orderDate: '2024-12-04',
      serviceDate: '2024-12-10',
      totalPrice: 300000,
      status: 'scheduled',
      timeline: [
        { date: '2024-12-04 16:30', status: 'order_placed', description: 'Pesanan berhasil dibuat' },
        { date: '2024-12-04 17:00', status: 'payment_confirmed', description: 'Pembayaran dikonfirmasi' },
        { date: '2024-12-05 10:00', status: 'scheduled', description: 'Tim dan bibit disiapkan' }
      ],
      teamInfo: {
        leader: 'Pak Agus',
        phone: '+62 814-5678-9012',
        equipment: ['Mesin Tanam', '4 Pekerja', 'Bibit Padi']
      },
      customerInfo: {
        name: 'Pak Ahmad Fauzi',
        phone: '+62 815-4567-8901',
        email: 'ahmad.fauzi@email.com'
      }
    },
    {
      id: 'TJS-20241202-004',
      service: 'Jasa Panen',
      farmSize: '3 Ha',
      location: 'Indramayu, Jawa Barat',
      orderDate: '2024-12-02',
      serviceDate: '2024-12-06',
      totalPrice: 450000,
      status: 'cancelled',
      timeline: [
        { date: '2024-12-02 11:00', status: 'order_placed', description: 'Pesanan berhasil dibuat' },
        { date: '2024-12-02 11:30', status: 'payment_confirmed', description: 'Pembayaran dikonfirmasi' },
        { date: '2024-12-05 08:00', status: 'cancelled', description: 'Dibatalkan karena cuaca buruk' }
      ],
      teamInfo: {
        leader: 'Pak Rahman',
        phone: '+62 815-1234-5678',
        equipment: ['Combine Harvester', '3 Operator']
      },
      customerInfo: {
        name: 'Pak Joko Susilo',
        phone: '+62 816-2345-6789',
        email: 'joko.susilo@email.com'
      },
      cancellationReason: 'Cuaca buruk - hujan deras berkelanjutan'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai'
      case 'in_progress': return 'Dalam Proses'
      case 'scheduled': return 'Terjadwal'
      case 'cancelled': return 'Dibatalkan'
      case 'pending': return 'Menunggu'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'order_placed': return <Package className="h-4 w-4" />
      case 'payment_confirmed': return <CheckCircle className="h-4 w-4" />
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'in_progress': return <Truck className="h-4 w-4" />
      case 'working': return <Settings className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredOrders = (isLoading ? mockOrders : orders).filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const currentOrders = isLoading ? mockOrders : orders
  const orderStats = {
    total: currentOrders.length,
    completed: currentOrders.filter(o => o.status === 'completed').length,
    inProgress: currentOrders.filter(o => o.status === 'in_progress').length,
    scheduled: currentOrders.filter(o => o.status === 'scheduled').length,
    cancelled: currentOrders.filter(o => o.status === 'cancelled').length
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pesanan Saya
          </h1>
          <p className="text-xl text-gray-600">
            Kelola dan pantau semua pesanan layanan pertanian Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Berjalan</p>
                  <p className="text-2xl font-bold text-blue-600">{orderStats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terjadwal</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.scheduled}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dibatalkan</p>
                  <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan ID pesanan, layanan, atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="in_progress">Dalam Proses</SelectItem>
                    <SelectItem value="scheduled">Terjadwal</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Memuat data pesanan...</p>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Tidak ada pesanan ditemukan
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Coba ubah filter pencarian Anda'
                    : 'Belum ada pesanan yang dibuat'}
                </p>
                <Button 
                  onClick={() => setActiveSection('services')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Pesan Layanan Sekarang
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-2">
                        {order.service} - {order.farmSize}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {order.id}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.serviceDate).toLocaleDateString('id-ID')}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {order.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {expandedOrder === order.id ? 'Tutup' : 'Detail'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-semibold text-gray-900">
                        Rp {order.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Dipesan: {new Date(order.orderDate).toLocaleDateString('id-ID')}
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {order.timeline.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                          <div className={`p-2 rounded-full ${
                            index === order.timeline.length - 1 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {getTimelineIcon(item.status)}
                          </div>
                          {index < order.timeline.length - 1 && (
                            <div className="w-8 h-0.5 bg-gray-200"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Status terakhir: {order.timeline[order.timeline.length - 1].description}
                    </p>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="border-t pt-6">
                      <Tabs defaultValue="timeline" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="timeline">Timeline</TabsTrigger>
                          <TabsTrigger value="team">Tim</TabsTrigger>
                          <TabsTrigger value="invoice">Invoice</TabsTrigger>
                        </TabsList>

                        <TabsContent value="timeline" className="mt-6">
                          <div className="space-y-4">
                            {order.timeline.slice().reverse().map((item, index) => (
                              <div key={index} className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${
                                  index === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {getTimelineIcon(item.status)}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.description}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(item.date).toLocaleString('id-ID')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          {order.cancellationReason && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center gap-2 text-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <span className="font-medium">Alasan Pembatalan:</span>
                              </div>
                              <p className="text-red-700 mt-1">{order.cancellationReason}</p>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="team" className="mt-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  Informasi Tim
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Ketua Tim:</span>
                                    <span className="font-medium">{order.teamInfo.leader}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Kontak:</span>
                                    <span className="font-medium">{order.teamInfo.phone}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button size="sm" variant="outline">
                                    <Phone className="h-4 w-4 mr-1" />
                                    Telepon
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    Chat
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Tractor className="h-4 w-4" />
                                  Peralatan
                                </h4>
                                <ul className="space-y-1">
                                  {order.teamInfo.equipment.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="invoice" className="mt-6">
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-semibold">Invoice #{order.id}</h4>
                                  <p className="text-sm text-gray-600">
                                    Tanggal: {new Date(order.orderDate).toLocaleDateString('id-ID')}
                                  </p>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Informasi Pelanggan
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Nama:</span>
                                  <span className="font-medium">{order.customerInfo.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Telepon:</span>
                                  <span className="font-medium">{order.customerInfo.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium">{order.customerInfo.email}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Layanan:</span>
                                <span>{order.service}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Luas/Durasi:</span>
                                <span>{order.farmSize}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Lokasi:</span>
                                <span className="text-right max-w-xs">{order.location}</span>
                              </div>
                              <div className="border-t pt-2 flex justify-between font-semibold">
                                <span>Total:</span>
                                <span>Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Butuh layanan lagi?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setActiveSection('services')}
              className="bg-green-600 hover:bg-green-700"
            >
              Pesan Layanan Baru
            </Button>
            <Button 
              variant="outline"
              onClick={() => setActiveSection('home')}
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}