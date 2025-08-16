"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Users, Trophy } from "lucide-react"
import { useState } from "react"

export function Hero() {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  const ticketSections = Array.from({ length: 10 }, (_, i) => {
    const start = i * 1000
    const end = start + 999
    const available = 1000 // All tickets available to match buy tickets page
    return {
      range: `${start.toString().padStart(4, "0")}-${end.toString().padStart(4, "0")}`,
      available,
      total: 1000,
      sectionIndex: i,
    }
  })

  const handleTicketBoxClick = (sectionIndex: number) => {
    window.location.href = `/buy-tickets?section=${sectionIndex}`
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
                onClick={() => (window.location.href = "/buy-tickets")}
              >
                Comprar Boletos Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
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
                    className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:border-amber-400 hover:shadow-md hover:scale-105 group"
                    onClick={() => handleTicketBoxClick(section.sectionIndex)}
                  >
                    <div className="text-center">
                      <div className="font-bold text-slate-800 text-sm mb-1 group-hover:text-amber-600 transition-colors">
                        {section.range}
                      </div>
                      <div className="text-xs text-slate-600 mb-2">{section.available} Disponibles</div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all group-hover:bg-amber-500"
                          style={{ width: `${(section.available / section.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium text-slate-700 mt-1 group-hover:text-amber-600 transition-colors">
                        100%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 mb-3">
                  Haz clic en cualquier sección para ver y seleccionar boletos
                </p>
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  onClick={() => (window.location.href = "/buy-tickets")}
                >
                  Ver Todos los Boletos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
