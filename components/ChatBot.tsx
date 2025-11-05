import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { X, MessageCircle, Send, Bot, User, Clock } from 'lucide-react'

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
  setActiveSection: (section: string) => void
}

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  quickReplies?: string[]
}

export function ChatBot({ isOpen, onClose, setActiveSection }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Halo! Saya adalah asisten virtual Tejoss. Saya siap membantu Anda dengan informasi layanan pertanian kami. Ada yang bisa saya bantu?',
      timestamp: new Date(),
      quickReplies: ['Info Harga', 'Cara Pesan', 'Lokasi Layanan', 'Hubungi CS']
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const predefinedResponses: { [key: string]: { content: string, quickReplies?: string[] } } = {
    'info harga': {
      content: 'Berikut kisaran harga layanan kami:\n\n• Jasa Panen: Rp 150.000/Ha\n• Jasa Tanam: Rp 200.000/Ha\n• Jasa Angkut: Rp 50.000/ton\n• Sewa Traktor: Rp 300.000/hari\n\nHarga dapat berubah tergantung lokasi dan kondisi lahan. Untuk estimasi akurat, silakan gunakan form pemesanan kami.',
      quickReplies: ['Pesan Sekarang', 'Lihat Semua Layanan', 'Konsultasi Gratis']
    },
    'cara pesan': {
      content: 'Cara pesan layanan Tejoss sangat mudah:\n\n1. Pilih jenis layanan yang dibutuhkan\n2. Isi form pemesanan dengan detail lahan\n3. Dapatkan estimasi harga otomatis\n4. Konfirmasi pesanan dan jadwal\n5. Tim kami akan menghubungi Anda\n\nProses ini hanya membutuhkan waktu 5 menit!',
      quickReplies: ['Pesan Sekarang', 'Lihat Tutorial', 'Bantuan Lain']
    },
    'lokasi layanan': {
      content: 'Saat ini Tejoss melayani area:\n\n✅ Jawa Barat (Karawang, Subang, Indramayu)\n✅ Jawa Tengah (Brebes, Tegal, Pemalang)\n✅ Jawa Timur (Lamongan, Gresik, Sidoarjo)\n✅ Lampung (Lampung Utara, Tulang Bawang)\n\nArea layanan terus berkembang. Hubungi kami untuk cek ketersediaan di lokasi Anda.',
      quickReplies: ['Cek Lokasi Saya', 'Request Area Baru', 'Info Lainnya']
    },
    'hubungi cs': {
      content: 'Anda bisa menghubungi customer service kami melalui:\n\n📱 WhatsApp: +62 812-3456-7890\n📞 Telepon: +62 21-1234-5678\n📧 Email: info@tejoss.id\n\nJam operasional:\nSenin-Jumat: 08:00-17:00\nSabtu: 08:00-15:00\nMinggu: Tutup\n\nUntuk emergency, layanan 24/7 tersedia melalui WhatsApp.',
      quickReplies: ['Chat WhatsApp', 'Kirim Email', 'Panggil Sekarang']
    },
    'pesan sekarang': {
      content: 'Siap! Saya akan mengarahkan Anda ke halaman pemesanan. Di sana Anda dapat memilih layanan, mengisi detail lahan, dan mendapatkan estimasi harga otomatis.',
      quickReplies: ['Ya, Lanjutkan', 'Tanya Dulu', 'Nanti Saja']
    },
    'konsultasi gratis': {
      content: 'Bagus! Konsultasi gratis tersedia untuk:\n\n• Pemilihan layanan yang tepat\n• Estimasi biaya operasional\n• Perencanaan jadwal kerja\n• Tips peningkatan produktivitas\n\nKonsultasi bisa dilakukan via WhatsApp, telepon, atau kunjungan langsung ke lahan (area tertentu).',
      quickReplies: ['Konsultasi WhatsApp', 'Jadwalkan Kunjungan', 'Telepon Sekarang']
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const lowerMessage = message.toLowerCase()
      let botResponse = predefinedResponses[lowerMessage]

      // Check for partial matches
      if (!botResponse) {
        for (const key in predefinedResponses) {
          if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
            botResponse = predefinedResponses[key]
            break
          }
        }
      }

      // Default response if no match found
      if (!botResponse) {
        if (lowerMessage.includes('harga') || lowerMessage.includes('biaya')) {
          botResponse = predefinedResponses['info harga']
        } else if (lowerMessage.includes('pesan') || lowerMessage.includes('order')) {
          botResponse = predefinedResponses['cara pesan']
        } else if (lowerMessage.includes('lokasi') || lowerMessage.includes('area')) {
          botResponse = predefinedResponses['lokasi layanan']
        } else {
          botResponse = {
            content: 'Maaf, saya tidak mengerti pertanyaan Anda. Berikut beberapa topik yang bisa saya bantu:',
            quickReplies: ['Info Harga', 'Cara Pesan', 'Lokasi Layanan', 'Hubungi CS']
          }
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        quickReplies: botResponse.quickReplies
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Ya, Lanjutkan':
      case 'Pesan Sekarang':
        onClose()
        setActiveSection('order')
        break
      case 'Lihat Semua Layanan':
        onClose()
        setActiveSection('services')
        break
      case 'Chat WhatsApp':
        window.open('https://wa.me/6281234567890', '_blank')
        break
      case 'Kirim Email':
        window.open('mailto:info@tejoss.id', '_blank')
        break
      case 'Panggil Sekarang':
        window.open('tel:+6281234567890', '_blank')
        break
      default:
        handleSendMessage(action)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 h-96 shadow-xl border-green-200">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5" />
              Asisten Tejoss
            </CardTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-green-700 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span>Online - Respons Cepat</span>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-start gap-2 mb-1">
                    {message.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 text-green-600" />}
                    {message.type === 'user' && <User className="h-4 w-4 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <div className="flex items-center gap-1 mt-1 opacity-70">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          {message.timestamp.toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Replies */}
                  {message.quickReplies && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction(reply)}
                          className="text-xs py-1 px-2 h-auto bg-white border-green-200 text-green-600 hover:bg-green-50"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-green-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputMessage)
              }}
              className="flex gap-2"
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-green-600 hover:bg-green-700"
                disabled={isTyping || !inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Chat Launcher Button
interface ChatLauncherProps {
  onClick: () => void
}

export function ChatLauncher({ onClick }: ChatLauncherProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        onClick={onClick}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full h-14 w-14 shadow-lg animate-pulse"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      <Badge className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1">
        Online
      </Badge>
    </div>
  )
}