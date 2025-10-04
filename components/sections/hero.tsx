"use client"

import { Star, Users, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAllTickets } from "@/lib/hooks/use-tickets"

export function Hero() {
  const router = useRouter()
  const { sectionCounts, isLoading: isLoadingAllTickets } = useAllTickets()

  const ticketSections = Array.from({ length: 10 }, (_, i) => {
    const start = i * 1000
    const end = start + 999
    const sectionInfo = sectionCounts.find((s) => s.section === i)
    const available = sectionInfo?.available ?? 0

    return {
      range: `${start.toString().padStart(4, "0")}-${end.toString().padStart(4, "0")}`,
      available,
      total: 1000,
      sectionIndex: i,
    }
  })

  const handleSectionClick = (sectionIndex: number) => {
    router.push(`/buy-tickets?section=${sectionIndex}`)
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">$500k MXN</span>
                </div>
                <p className="text-muted-foreground">Premios Ganados</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">25K+</span>
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
              <p className="text-slate-600 text-center mb-2">10,000 Boletos Totales</p>
              <p className="text-xs text-emerald-600 text-center mb-6 font-semibold">
                ✓ Actualizado en tiempo real - Haz clic para comprar
              </p>

              <div className="grid grid-cols-2 gap-3">
                {ticketSections.map((section) => (
                  <div
                    key={section.range}
                    onClick={() => handleSectionClick(section.sectionIndex)}
                    className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 transition-all duration-300 cursor-pointer hover:border-amber-400 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <div className="text-center">
                      <div className="font-bold text-slate-800 text-sm mb-1">{section.range}</div>
                      <div className="text-xs text-slate-600 mb-2">
                        {isLoadingAllTickets ? "..." : `${section.available} Disponibles`}
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${(section.available / section.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium text-slate-700 mt-1">
                        {Math.round((section.available / section.total) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">Haz clic en cualquier rango para ver y comprar boletos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
