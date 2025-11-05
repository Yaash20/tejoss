import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Calendar, MapPin, Clock, CreditCard, Calculator, CheckCircle } from 'lucide-react'

interface OrderPageProps {
  setActiveSection: (section: string) => void
}

export function OrderPage({ setActiveSection }: OrderPageProps) {
  const [formData, setFormData] = useState({
    serviceType: '',
    servicePackage: '',
    area: '',
    location: '',
    date: '',
    urgency: 'normal',
    additionalServices: [] as string[],
    notes: '',
    paymentMethod: ''
  })

  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [showEstimation, setShowEstimation] = useState(false)

  const services = [
    { id: 'panen', name: 'Jasa Panen', basePrice: 150000, unit: 'Ha' },
    { id: 'tanam', name: 'Jasa Tanam', basePrice: 200000, unit: 'Ha' },
    { id: 'angkut', name: 'Jasa Angkut', basePrice: 50000, unit: 'ton' },
    { id: 'giling', name: 'Jasa Giling', basePrice: 100000, unit: 'ton' },
    { id: 'traktor', name: 'Sewa Traktor', basePrice: 300000, unit: 'hari' },
    { id: 'tenaga', name: 'Tenaga Kerja', basePrice: 100000, unit: 'orang/hari' }
  ]

  const packages = [
    { id: 'starter', name: 'Paket Starter', price: 2500000, discount: 0.1 },
    { id: 'professional', name: 'Paket Professional', price: 4500000, discount: 0.15 },
    { id: 'enterprise', name: 'Paket Enterprise', price: 8000000, discount: 0.25 }
  ]

  const additionalServices = [
    { id: 'konsultasi', name: 'Konsultasi Ahli', price: 500000 },
    { id: 'soil-testing', name: 'Soil Testing', price: 750000 },
    { id: 'pest-control', name: 'Pest Control', price: 300000 },
    { id: 'monitoring', name: 'Monitoring Khusus', price: 200000 }
  ]

  const calculateEstimate = () => {
    let total = 0
    const selectedService = services.find(s => s.id === formData.serviceType)
    
    if (selectedService && formData.area) {
      total = selectedService.basePrice * parseFloat(formData.area)
    }

    // Add package discount
    if (formData.servicePackage) {
      const selectedPackage = packages.find(p => p.id === formData.servicePackage)
      if (selectedPackage) {
        total = total * (1 - selectedPackage.discount)
      }
    }

    // Add additional services
    formData.additionalServices.forEach(serviceId => {
      const additionalService = additionalServices.find(s => s.id === serviceId)
      if (additionalService) {
        total += additionalService.price
      }
    })

    // Urgency multiplier
    if (formData.urgency === 'urgent') {
      total = total * 1.2
    } else if (formData.urgency === 'express') {
      total = total * 1.5
    }

    setEstimatedPrice(total)
    setShowEstimation(true)
  }

  const handleAdditionalServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        additionalServices: [...formData.additionalServices, serviceId]
      })
    } else {
      setFormData({
        ...formData,
        additionalServices: formData.additionalServices.filter(id => id !== serviceId)
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert('Pesanan berhasil dikirim! Tim kami akan menghubungi Anda dalam 24 jam.')
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pesan Jasa Pertanian
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Isi form di bawah untuk mendapatkan estimasi harga dan jadwal layanan yang sesuai kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Form Pemesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Type */}
                  <div>
                    <Label>Jenis Layanan *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis layanan" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - Rp {service.basePrice.toLocaleString('id-ID')}/{service.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Package Selection */}
                  <div>
                    <Label>Paket Langganan (Opsional)</Label>
                    <Select value={formData.servicePackage} onValueChange={(value) => setFormData({...formData, servicePackage: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih paket langganan" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map(pkg => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name} - Diskon {(pkg.discount * 100)}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Luas Area *</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Contoh: 2.5"
                          value={formData.area}
                          onChange={(e) => setFormData({...formData, area: e.target.value})}
                          className="pr-12"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          {services.find(s => s.id === formData.serviceType)?.unit || 'unit'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Lokasi Lahan *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Alamat lengkap lahan"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Urgency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tanggal Pengerjaan *</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Tingkat Urgensi</Label>
                      <RadioGroup value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal">Normal (Harga standar)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="urgent" id="urgent" />
                          <Label htmlFor="urgent">Urgent (+20%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express">Express (+50%)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div>
                    <Label>Layanan Tambahan</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {additionalServices.map(service => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={service.id}
                            checked={formData.additionalServices.includes(service.id)}
                            onCheckedChange={(checked) => handleAdditionalServiceChange(service.id, checked as boolean)}
                          />
                          <Label htmlFor={service.id} className="text-sm">
                            {service.name} (+Rp {service.price.toLocaleString('id-ID')})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label>Catatan Tambahan</Label>
                    <Textarea
                      placeholder="Jelaskan kebutuhan khusus atau informasi tambahan..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label>Metode Pembayaran *</Label>
                    <RadioGroup value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer">Transfer Bank</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ewallet" id="ewallet" />
                        <Label htmlFor="ewallet">E-Wallet (GoPay, OVO, Dana)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash on Service</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Calculate Button */}
                  <Button
                    type="button"
                    onClick={calculateEstimate}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Hitung Estimasi Harga
                  </Button>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!formData.serviceType || !formData.area || !formData.location || !formData.date || !formData.paymentMethod}
                  >
                    Kirim Pesanan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Price Estimation */}
              {showEstimation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-green-600" />
                      Estimasi Harga
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Layanan Utama:</span>
                        <span>Rp {(services.find(s => s.id === formData.serviceType)?.basePrice || 0 * parseFloat(formData.area || '0')).toLocaleString('id-ID')}</span>
                      </div>
                      {formData.servicePackage && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Diskon Paket:</span>
                          <span>-{(packages.find(p => p.id === formData.servicePackage)?.discount || 0) * 100}%</span>
                        </div>
                      )}
                      {formData.additionalServices.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Layanan Tambahan:</span>
                          <span>Rp {formData.additionalServices.reduce((total, serviceId) => {
                            const service = additionalServices.find(s => s.id === serviceId)
                            return total + (service?.price || 0)
                          }, 0).toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      {formData.urgency !== 'normal' && (
                        <div className="flex justify-between text-sm">
                          <span>Biaya Urgensi:</span>
                          <span>+{formData.urgency === 'urgent' ? '20' : '50'}%</span>
                        </div>
                      )}
                      <hr />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Estimasi:</span>
                        <span className="text-green-600">Rp {estimatedPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Informasi Pemesanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Response Time</p>
                      <p className="text-xs text-gray-600">Tim kami akan menghubungi dalam 24 jam</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pembayaran</p>
                      <p className="text-xs text-gray-600">DP 30% setelah konfirmasi, sisanya setelah selesai</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800">
                      Garansi Kualitas 100%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-4">Butuh bantuan dalam pemesanan?</p>
                  <Button variant="outline" className="w-full">
                    Hubungi Customer Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}