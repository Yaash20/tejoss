import { useState } from 'react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from './ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Menu, Phone, Mail, User, LogOut, MessageSquare, Package } from 'lucide-react'
import logoImage from 'figma:asset/397a17fe4b503d4612b82ef199f5287580382756.png'

interface HeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
  user?: any
  onLogout?: () => void
}

export function Header({ activeSection, setActiveSection, user, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'services', label: 'Layanan' },
    { id: 'testimonials', label: 'Testimoni' },
    { id: 'education', label: 'Edukasi' },
    { id: 'about', label: 'Tentang Kami' }
  ]

  const handleNavClick = (section: string) => {
    setActiveSection(section)
    setIsOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-green-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@tejoss.id</span>
              </div>
            </div>
            <div className="text-sm">
              Layanan 24/7 untuk kebutuhan pertanian Anda
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src={logoImage} 
              alt="Tejoss - Petani Joss" 
              className="h-12 w-auto cursor-pointer"
              onClick={() => handleNavClick('home')}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-2 px-1 transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                )}
              </button>
            ))}
          </nav>

          {/* User Menu or CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || ''} />
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavClick('order')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Pesan Layanan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('testimonials')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil & Testimoni</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('myorders')}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Pesanan Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => handleNavClick('login')}
                  className="text-gray-700 hover:text-green-600"
                >
                  Masuk
                </Button>
                <Button 
                  onClick={() => handleNavClick('order')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  Pesan Sekarang
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu Navigasi</SheetTitle>
                <SheetDescription>
                  Menu navigasi untuk mengakses berbagai halaman di website Tejoss
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left py-3 px-4 rounded-lg transition-colors duration-200 ${
                      activeSection === item.id
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t space-y-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                      <Button 
                        onClick={() => handleNavClick('order')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        Pesan Sekarang
                      </Button>
                      <Button 
                        onClick={onLogout}
                        variant="outline"
                        className="w-full text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Keluar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={() => handleNavClick('login')}
                        variant="outline"
                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                      >
                        Masuk
                      </Button>
                      <Button 
                        onClick={() => handleNavClick('order')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        Pesan Sekarang
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}