import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { 
  ArrowLeft, 
  CreditCard, 
  Shield,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  CalendarDays,
  Calculator,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

// Declare Midtrans Snap globally
declare global {
  interface Window {
    snap: any
  }
}

interface PaymentPageProps {
  setActiveSection: (section: string) => void
  selectedService?: {
    id: string
    name: string
    price: number
    unit: string
    description: string
    category: string
  }
  selectedPackage?: {
    id: string
    name: string
    price: number
    discount: number
  }
}

export function PaymentPage({ setActiveSection, selectedService, selectedPackage }: PaymentPageProps) {
  const [step, setStep] = useState(1) // 1: Info Pelanggan, 2: Konfirmasi Pesanan, 3: Pembayaran/Success
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',    
    phone: '',
    address: '',
    farmSize: '',
    serviceDate: '',
    urgency: 'normal',
    notes: '',
    acceptTerms: false
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [orderNumber, setOrderNumber] = useState<string>('')

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('tejoss_user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setCustomerData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }))
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
  }, [])

  // Calculate pricing
  const basePrice = selectedService ? selectedService.price * parseFloat(customerData.farmSize || '1') : 0
  const packageDiscount = selectedPackage ? basePrice * selectedPackage.discount : 0
  const urgencyMultiplier = customerData.urgency === 'urgent' ? 1.2 : customerData.urgency === 'express' ? 1.5 : 1
  const subtotal = (basePrice - packageDiscount) * urgencyMultiplier
  const adminFee = 5000
  const tax = subtotal * 0.11 // PPN 11%
  const total = subtotal + adminFee + tax

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCreateOrder = async () => {
    setIsProcessing(true)
    
    try {
      const token = localStorage.getItem('tejoss_token')
      if (!token) {
        toast.error('Silakan login terlebih dahulu')
        setActiveSection('login')
        return
      }

      // Create order in backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service_id: selectedService?.id,
          quantity: parseFloat(customerData.farmSize),
          location: customerData.address,
          schedule_date: customerData.serviceDate,
          notes: customerData.notes
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat pesanan')
      }

      setOrderId(data.data.id)
      setOrderNumber(data.data.order_number)

      // Create Midtrans transaction
      const midtransResponse = await fetch('http://localhost:5000/api/payments/midtrans/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: data.data.id
        })
      })

      const midtransData = await midtransResponse.json()

      if (!midtransResponse.ok) {
        throw new Error(midtransData.message || 'Gagal membuat transaksi pembayaran')
      }

      // Open Midtrans Snap
      if (window.snap) {
        window.snap.pay(midtransData.data.token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result)
            toast.success('Pembayaran berhasil!')
            
            // Wait a bit for webhook to process, then go to success page
            setTimeout(() => {
              setStep(3)
            }, 1000)
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result)
            toast.info('Pembayaran sedang diproses')
            setActiveSection('myorders')
          },
          onError: function(result: any) {
            console.log('Payment error:', result)
            toast.error('Pembayaran gagal. Silakan coba lagi.')
          },
          onClose: function() {
            console.log('Payment popup closed')
            toast.info('Pembayaran dibatalkan')
          }
        })
      } else {
        throw new Error('Midtrans Snap tidak tersedia. Silakan refresh halaman.')
      }

    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            step >= stepNum 
              ? 'bg-green-600 border-green-600 text-white' 
              : 'border-gray-300 text-gray-300'
          }`}>
            {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
          </div>
          {stepNum < 3 && (
            <div className={`w-16 h-0.5 ${
              step > stepNum ? 'bg-green-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderCustomerInfoStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
            Informasi Pelanggan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nama Lengkap *</Label>
              <Input
                placeholder="Masukkan nama lengkap"
                value={customerData.name}
                onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="email@contoh.com"
                value={customerData.email}
                onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>No. Telepon *</Label>
              <Input
                placeholder="+62 812-3456-7890"
                value={customerData.phone}
                onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Luas Lahan *</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="2.5"
                  value={customerData.farmSize}
                  onChange={(e) => setCustomerData({...customerData, farmSize: e.target.value})}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {selectedService?.unit || 'Ha'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Alamat Lahan *</Label>
            <Textarea
              placeholder="Alamat lengkap lokasi lahan"
              value={customerData.address}
              onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tanggal Pelaksanaan *</Label>
              <Input
                type="date"
                value={customerData.serviceDate}
                onChange={(e) => setCustomerData({...customerData, serviceDate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Tingkat Urgensi</Label>
              <Select value={customerData.urgency} onValueChange={(value) => setCustomerData({...customerData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (Harga standar)</SelectItem>
                  <SelectItem value="urgent">Urgent (+20%)</SelectItem>
                  <SelectItem value="express">Express (+50%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Catatan Tambahan</Label>
            <Textarea
              placeholder="Informasi khusus atau permintaan tambahan..."
              value={customerData.notes}
              onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={customerData.acceptTerms}
              onCheckedChange={(checked) => setCustomerData({...customerData, acceptTerms: checked as boolean})}
            />
            <Label htmlFor="terms" className="text-sm">
              Saya menyetujui <button className="text-green-600 underline">syarat dan ketentuan</button> yang berlaku
            </Label>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setActiveSection('services')}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Layanan
            </Button>
            <Button
              onClick={handleNextStep}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!customerData.name || !customerData.email || !customerData.phone || !customerData.address || !customerData.farmSize || !customerData.serviceDate || !customerData.acceptTerms}
            >
              Lanjutkan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrderConfirmation = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Konfirmasi Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Details */}
              <div>
                <h3 className="font-semibold mb-3">Detail Layanan</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{selectedService?.name}</p>
                      <p className="text-sm text-gray-600">{selectedService?.description}</p>
                      {selectedPackage && (
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          {selectedPackage.name} - Diskon {selectedPackage.discount * 100}%
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {customerData.farmSize} {selectedService?.unit}
                      </p>
                      <p className="text-sm text-gray-600">
                        @Rp {selectedService?.price.toLocaleString('id-ID')}/{selectedService?.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Informasi Pelanggan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{customerData.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{customerData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{customerData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <span>{new Date(customerData.serviceDate).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-sm">{customerData.address}</span>
                </div>
              </div>

              {/* Additional Info */}
              {(customerData.urgency !== 'normal' || customerData.notes) && (
                <div>
                  <h3 className="font-semibold mb-3">Informasi Tambahan</h3>
                  <div className="space-y-2 text-sm">
                    {customerData.urgency !== 'normal' && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>Urgensi: {customerData.urgency === 'urgent' ? 'Urgent (+20%)' : 'Express (+50%)'}</span>
                      </div>
                    )}
                    {customerData.notes && (
                      <div>
                        <p className="font-medium">Catatan:</p>
                        <p className="text-gray-600">{customerData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Midtrans Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Pembayaran Aman dengan Midtrans</p>
                    <p className="text-blue-700">
                      Anda akan diarahkan ke halaman pembayaran Midtrans yang aman. 
                      Pilih metode pembayaran favorit Anda: Transfer Bank, E-Wallet, Kartu Kredit, atau Virtual Account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Edit Informasi
                </Button>
                <Button
                  onClick={handleCreateOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Bayar Sekarang
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Ringkasan Harga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Harga Layanan:</span>
                  <span>Rp {basePrice.toLocaleString('id-ID')}</span>
                </div>
                {packageDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon Paket:</span>
                    <span>-Rp {packageDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {customerData.urgency !== 'normal' && (
                  <div className="flex justify-between text-orange-600">
                    <span>Biaya Urgensi:</span>
                    <span>+{((urgencyMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Biaya Admin:</span>
                  <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN 11%:</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Shield className="h-4 w-4" />
                  <span>Pembayaran Aman & Terjamin</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CreditCard className="h-4 w-4" />
                  <span>Powered by Midtrans</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <Card>
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-gray-600">
              Pesanan Anda telah berhasil diproses. Tim kami akan segera menghubungi Anda.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID Pesanan:</span>
                <p className="font-mono font-medium">{orderNumber || 'TJS-XXXXXXXX'}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Dibayar:</span>
                <p className="font-bold text-green-600">
                  Rp {total.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Metode Pembayaran:</span>
                <p className="font-medium">Midtrans</p>
              </div>
              <div>
                <span className="text-gray-600">Tanggal Layanan:</span>
                <p className="font-medium">
                  {new Date(customerData.serviceDate).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Langkah Selanjutnya:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tim kami akan menghubungi Anda dalam 24 jam</li>
                <li>• Konfirmasi detail teknis dan jadwal</li>
                <li>• Pelaksanaan layanan sesuai jadwal</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setActiveSection('home')}
                variant="outline"
                className="flex-1"
              >
                Kembali ke Beranda
              </Button>
              <Button
                onClick={() => setActiveSection('myorders')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Lihat Status Pesanan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {step === 1 && 'Informasi Pelanggan'}
            {step === 2 && 'Konfirmasi Pesanan'}  
            {step === 3 && 'Pembayaran Berhasil'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {step === 1 && 'Lengkapi informasi Anda untuk melanjutkan pemesanan'}
            {step === 2 && 'Periksa kembali detail pesanan Anda sebelum melanjutkan ke pembayaran'}
            {step === 3 && 'Terima kasih atas kepercayaan Anda menggunakan layanan Tejoss'}
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {step === 1 && renderCustomerInfoStep()}
        {step === 2 && renderOrderConfirmation()}
        {step === 3 && renderSuccessStep()}
      </div>
    </div>
  )
}