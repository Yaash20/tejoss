import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Checkbox } from './ui/checkbox'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Facebook,
  Chrome,
  Shield,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'
import logoImage from 'figma:asset/397a17fe4b503d4612b82ef199f5287580382756.png'

interface LoginPageProps {
  setActiveSection: (section: string) => void
  onLoginSuccess?: (user: any) => void
}

export function LoginPage({ setActiveSection, onLoginSuccess }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    subscribeNewsletter: true
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal')
      }

      // Store token
      localStorage.setItem('tejoss_token', data.data.token)

      const userData = {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
        avatar: data.data.user.avatar_url,
        token: data.data.token
      }
      
      if (onLoginSuccess) {
        onLoginSuccess(userData)
      }
      
      toast.success('Login berhasil! Selamat datang di Tejoss.')
      
      // Redirect based on role
      if (userData.role === 'admin') {
        setActiveSection('admin')
      } else {
        setActiveSection('home')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Terjadi kesalahan saat login')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok!')
      return
    }

    if (!registerData.agreeTerms) {
      toast.error('Anda harus menyetujui syarat dan ketentuan!')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal')
      }

      // Store token
      localStorage.setItem('tejoss_token', data.data.token)

      const userData = {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
        avatar: data.data.user.avatar_url,
        token: data.data.token
      }

      if (onLoginSuccess) {
        onLoginSuccess(userData)
      }
      
      toast.success('Registrasi berhasil! Akun Anda telah dibuat.')
      setActiveSection('home')
    } catch (error: any) {
      console.error('Register error:', error)
      toast.error(error.message || 'Terjadi kesalahan saat registrasi')
    }
  }

  const handleSocialLogin = (provider: string) => {
    const mockUser = {
      name: `User ${provider}`,
      email: `user@${provider.toLowerCase()}.com`,
      role: 'farmer',
      avatar: null
    }

    if (onLoginSuccess) {
      onLoginSuccess(mockUser)
    }
    
    alert(`Login dengan ${provider} berhasil!`)
    setActiveSection('home')
  }

  const benefits = [
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: "Akses Layanan Lengkap",
      description: "Pesan semua jasa pertanian dalam satu platform"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: "Tracking Pesanan Real-time",
      description: "Pantau progress pekerjaan dari smartphone Anda"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: "Konsultasi Gratis",
      description: "Akses konsultasi dengan ahli pertanian kapan saja"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: "Diskon Member Eksklusif",
      description: "Dapatkan harga khusus dan penawaran terbaik"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Benefits */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <img 
                src={logoImage} 
                alt="Tejoss - Petani Joss" 
                className="h-16 w-auto mx-auto lg:mx-0 mb-6"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Bergabunglah dengan <br />
                <span className="text-green-600">Revolusi Pertanian</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Akses layanan jasa pertanian modern, transparan, dan terpercaya. 
                Tingkatkan produktivitas lahan Anda bersama ribuan petani lainnya.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  {benefit.icon}
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-green-600 rounded-lg text-white text-center">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Data Anda Aman</p>
              <p className="text-sm text-green-100">
                Kami menggunakan enkripsi SSL dan mengikuti standar keamanan terbaik
              </p>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="max-w-md mx-auto w-full">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {activeTab === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Sekarang'}
                </CardTitle>
                <p className="text-gray-600">
                  {activeTab === 'login' 
                    ? 'Selamat datang kembali! Masuk untuk melanjutkan.' 
                    : 'Bergabunglah dengan komunitas petani modern Indonesia'
                  }
                </p>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Masuk</TabsTrigger>
                    <TabsTrigger value="register">Daftar</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="nama@email.com"
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remember"
                            checked={loginData.rememberMe}
                            onCheckedChange={(checked) => setLoginData({...loginData, rememberMe: checked as boolean})}
                          />
                          <Label htmlFor="remember" className="text-sm">Ingat saya</Label>
                        </div>
                        <Button variant="link" className="text-sm text-green-600 p-0">
                          Lupa password?
                        </Button>
                      </div>

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        Masuk
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Tab */}
                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="register-name">Nama Lengkap</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-name"
                            type="text"
                            placeholder="Nama lengkap Anda"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="nama@email.com"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="register-phone">No. Telepon</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="register-phone"
                              type="tel"
                              placeholder="+62 xxx xxx xxxx"
                              value={registerData.phone}
                              onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="register-location">Kota/Kabupaten</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="register-location"
                              type="text"
                              placeholder="Lokasi Anda"
                              value={registerData.location}
                              onChange={(e) => setRegisterData({...registerData, location: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Minimal 8 karakter"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            className="pl-10 pr-10"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Ulangi password"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agree-terms"
                            checked={registerData.agreeTerms}
                            onCheckedChange={(checked) => setRegisterData({...registerData, agreeTerms: checked as boolean})}
                          />
                          <Label htmlFor="agree-terms" className="text-sm">
                            Saya setuju dengan{' '}
                            <Button variant="link" className="text-green-600 p-0 h-auto text-sm">
                              Syarat & Ketentuan
                            </Button>{' '}
                            dan{' '}
                            <Button variant="link" className="text-green-600 p-0 h-auto text-sm">
                              Kebijakan Privasi
                            </Button>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="subscribe-newsletter"
                            checked={registerData.subscribeNewsletter}
                            onCheckedChange={(checked) => setRegisterData({...registerData, subscribeNewsletter: checked as boolean})}
                          />
                          <Label htmlFor="subscribe-newsletter" className="text-sm">
                            Berlangganan newsletter untuk tips pertanian dan penawaran khusus
                          </Label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        Daftar Sekarang
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Social Login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Atau masuk dengan</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full"
                    >
                      <Chrome className="h-4 w-4 mr-2" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin('Facebook')}
                      className="w-full"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button
                    variant="link"
                    onClick={() => setActiveSection('home')}
                    className="text-gray-600"
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}