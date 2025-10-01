"use client"

import { Star, Users, Trophy, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const ticketSections = Array.from({ length: 10 }, (_, i) => {
    const start = i * 1000
    const end = start + 999
    const available = 1000 // All tickets available
    return {
      range: `${start.toString().padStart(4, "0")}-${end.toString().padStart(4, "0")}`,
      available,
      total: 1000,
      sectionIndex: i,
    }
  })

  const handleContactWhatsApp = () => {
    const phoneNumber = "5212345678901" // Replace with actual WhatsApp number
    const message = encodeURIComponent(
      "Hola! Estoy interesado en comprar boletos para la rifa. ¿Podrían darme más información?",
    )
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, "_blank")
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary fill-current" />
                ))}
              </div>
              <span className="text-muted-foreground">Confiado por más de 50,000 jugadores</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Gana Premios Increíbles con
              <span className="text-primary"> Cada Boleto</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              ¡Únete a miles de ganadores en nuestras emocionantes rifas! Desde autos de lujo hasta vacaciones de
              ensueño, tu próxima gran victoria está a solo un boleto de distancia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-4"
                onClick={handleContactWhatsApp}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contactar por WhatsApp
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">$2M+</span>
                </div>
                <p className="text-muted-foreground">Premios Ganados</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">50K+</span>
                </div>
                <p className="text-muted-foreground">Ganadores Felices</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Star className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">4.9/5</span>
                </div>
                <p className="text-muted-foreground">Calificación</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Boletos Disponibles</h3>
              <p className="text-slate-600 text-center mb-6">10,000 Boletos Totales</p>

              <div className="grid grid-cols-2 gap-3">
                {ticketSections.map((section) => (
                  <div
                    key={section.range}
                    className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="font-bold text-slate-800 text-sm mb-1">{section.range}</div>
                      <div className="text-xs text-slate-600 mb-2">{section.available} Disponibles</div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${(section.available / section.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium text-slate-700 mt-1">100%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 mb-3">Contacta por WhatsApp para comprar boletos</p>
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  onClick={handleContactWhatsApp}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contactar Ahora
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
