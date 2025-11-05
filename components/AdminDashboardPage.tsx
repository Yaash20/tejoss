import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Search,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Eye,
  Edit
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminDashboardProps {
  setActiveSection: (section: string) => void
  handleLogout: () => void
}

export function AdminDashboardPage({ setActiveSection, handleLogout }: AdminDashboardProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    fetchAllOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('tejoss_token')
      
      if (!token) {
        toast.error('Sesi berakhir. Silakan login kembali')
        setActiveSection('login')
        return
      }

      // Get all orders (admin can see all)
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setOrders(data.data)
      } else {
        throw new Error(data.message || 'Gagal memuat data')
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      toast.error(error.message || 'Gagal memuat data pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('tejoss_token')
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          notes: `Status diubah menjadi ${getStatusText(newStatus)} oleh admin`
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Status pesanan berhasil diperbarui')
        fetchAllOrders() // Refresh data
        setSelectedOrder(null)
      } else {
        throw new Error(data.message || 'Gagal memperbarui status')
      }
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast.error(error.message || 'Gagal memperbarui status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'confirmed': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Pembayaran'
      case 'confirmed': return 'Terjadwal'
      case 'in_progress': return 'Sedang Berjalan'
      case 'completed': return 'Selesai'
      case 'cancelled': return 'Dibatalkan'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'unpaid': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Lunas'
      case 'unpaid': return 'Belum Dibayar'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + parseFloat(o.total_price), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-green-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Panel Admin Tejoss</h1>
              <p className="text-green-100 text-sm">Kelola semua pesanan dan layanan</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="bg-white text-green-600 hover:bg-green-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terjadwal</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.confirmed}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Berjalan</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendapatan</p>
                  <p className="text-lg font-bold text-green-600">
                    Rp {(stats.totalRevenue / 1000000).toFixed(1)}jt
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nomor order, layanan, atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="confirmed">Terjadwal</SelectItem>
                    <SelectItem value="in_progress">Berjalan</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada pesanan ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nomor Order</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Layanan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pembayaran</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium">{order.order_number}</td>
                        <td className="px-4 py-4 text-sm">
                          <div>
                            <p className="font-medium">{order.service_name}</p>
                            <p className="text-gray-500 text-xs">{order.quantity} {order.unit}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {new Date(order.schedule_date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium">
                          Rp {parseFloat(order.total_price).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Badge className={getPaymentStatusColor(order.payment_status)}>
                            {getPaymentStatusText(order.payment_status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Ubah Status
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Ubah Status Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nomor Order:</p>
                <p className="font-medium">{selectedOrder.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Layanan:</p>
                <p className="font-medium">{selectedOrder.service_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Status Saat Ini:</p>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Ubah Status Ke:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                    disabled={selectedOrder.payment_status !== 'paid'}
                  >
                    Terjadwal
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'in_progress')}
                    disabled={selectedOrder.payment_status !== 'paid'}
                  >
                    Berjalan
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    disabled={selectedOrder.payment_status !== 'paid'}
                  >
                    Selesai
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  >
                    Batalkan
                  </Button>
                </div>
                {selectedOrder.payment_status !== 'paid' && (
                  <p className="text-xs text-amber-600 mt-2">
                    ⚠️ Pesanan hanya bisa diubah setelah pembayaran lunas
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedOrder(null)}
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
