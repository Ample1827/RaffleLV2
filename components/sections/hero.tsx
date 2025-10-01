"use client"

import { useState } from "react"
import { Star, Users, Trophy, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useAllTickets, useTicketsByRange } from "@/lib/hooks/use-tickets"
import { ShoppingCart } from "lucide-react"

export function Hero() {
  const [openSectionDialog, setOpenSectionDialog] = useState<number | null>(null)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  const { sectionCounts, isLoading: isLoadingAllTickets } = useAllTickets()

  const ticketSections = Array.from({ length: 10 }, (_, i) => {
    const start = i * 1000
    const end = start + 999
    const sectionInfo = sectionCounts.find((s) => s.section === i)
    const available = sectionInfo?.available || 1000

    return {
      range: `${start.toString().padStart(4, "0")}-${end.toString().padStart(4, "0")}`,
      available,
      total: 1000,
      sectionIndex: i,
    }
  })

  const handleContactWhatsApp = () => {
    const phoneNumber = "5212345678901"
    const message = encodeURIComponent(
      "Hola! Estoy interesado en comprar boletos para la rifa. ¿Podrían darme más información?",
    )
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, "_blank")
  }

  const handleSectionClick = (sectionIndex: number) => {
    setOpenSectionDialog(sectionIndex)
  }

  const toggleTicketSelection = (ticketNumber: string, isAvailable: boolean) => {
    if (!isAvailable) {
      alert("Este boleto ya no está disponible")
      return
    }
    setSelectedTickets((prev) =>
      prev.includes(ticketNumber) ? prev.filter((t) => t !== ticketNumber) : [...prev, ticketNumber],
    )
  }

  const handlePurchaseFromDialog = () => {
    if (selectedTickets.length > 0) {
      // Redirect to buy tickets page with selected tickets
      const ticketsParam = selectedTickets.join(",")
      window.location.href = `/buy-tickets?tickets=${ticketsParam}`
    }
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
                <p className="text-sm text-slate-500 mb-3">Haz clic en cualquier rango para ver y comprar boletos</p>
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  onClick={handleContactWhatsApp}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contactar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openSectionDialog !== null && (
        <TicketSelectionDialog
          sectionIndex={openSectionDialog}
          open={openSectionDialog !== null}
          onOpenChange={(open) => {
            if (!open) {
              setOpenSectionDialog(null)
              setSelectedTickets([])
            }
          }}
          selectedTickets={selectedTickets}
          toggleTicketSelection={toggleTicketSelection}
          onPurchase={handlePurchaseFromDialog}
        />
      )}
    </section>
  )
}

function TicketSelectionDialog({
  sectionIndex,
  open,
  onOpenChange,
  selectedTickets,
  toggleTicketSelection,
  onPurchase,
}: {
  sectionIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTickets: string[]
  toggleTicketSelection: (ticketNumber: string, isAvailable: boolean) => void
  onPurchase: () => void
}) {
  const startNum = sectionIndex * 1000
  const endNum = startNum + 999
  const { tickets, availableCount, isLoading } = useTicketsByRange(startNum, endNum, open)

  const generateTicketNumbers = () => {
    if (tickets.length > 0) {
      return tickets.map((ticket) => ({
        number: ticket.ticket_number.toString().padStart(4, "0"),
        available: ticket.is_available,
      }))
    }

    const ticketList = []
    for (let i = 0; i < 1000; i++) {
      const ticketNumber = startNum + i
      ticketList.push({
        number: ticketNumber.toString().padStart(4, "0"),
        available: true,
      })
    }
    return ticketList
  }

  const ticketNumbers = generateTicketNumbers()
  const selectedInSection = selectedTickets.filter((ticket) => {
    const ticketNum = Number.parseInt(ticket)
    return ticketNum >= startNum && ticketNum <= endNum
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-amber-600 text-xl flex items-center justify-between">
            <span>
              Boletos {startNum.toString().padStart(4, "0")} - {endNum.toString().padStart(4, "0")}
            </span>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {availableCount} disponibles
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-10 gap-2 p-4">
                {ticketNumbers.map((ticket) => (
                  <Button
                    key={ticket.number}
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${
                      !ticket.available
                        ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed opacity-50"
                        : selectedTickets.includes(ticket.number)
                          ? "bg-amber-500 text-white border-amber-500"
                          : "border-slate-300 text-slate-700 bg-white hover:bg-amber-500 hover:text-white hover:border-amber-500"
                    }`}
                    onClick={() => toggleTicketSelection(ticket.number, ticket.available)}
                    disabled={!ticket.available}
                  >
                    {ticket.number}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-slate-300 bg-white rounded"></div>
                  <span className="text-slate-600">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded"></div>
                  <span className="text-slate-600">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span className="text-slate-600">Vendido</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-amber-600 font-semibold">
                  {selectedInSection.length > 0
                    ? `${selectedInSection.length} seleccionados`
                    : `${availableCount} disponibles`}
                </p>
                {selectedInSection.length > 0 && (
                  <Button onClick={onPurchase} className="bg-emerald-500 hover:bg-emerald-600 text-white" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Comprar Seleccionados
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
