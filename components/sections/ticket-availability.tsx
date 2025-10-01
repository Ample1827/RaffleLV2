"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react"
import { getTicketsByRange, createPurchaseWithoutAuth } from "@/lib/database"
import { openWhatsApp } from "@/lib/whatsapp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface Ticket {
  id: string
  ticket_number: number
  is_available: boolean
  created_at: string
}

interface TicketRange {
  start: number
  end: number
  label: string
}

const TICKET_RANGES: TicketRange[] = [
  { start: 0, end: 999, label: "0000-0999" },
  { start: 1000, end: 1999, label: "1000-1999" },
  { start: 2000, end: 2999, label: "2000-2999" },
  { start: 3000, end: 3999, label: "3000-3999" },
  { start: 4000, end: 4999, label: "4000-4999" },
  { start: 5000, end: 5999, label: "5000-5999" },
  { start: 6000, end: 6999, label: "6000-6999" },
  { start: 7000, end: 7999, label: "7000-7999" },
  { start: 8000, end: 8999, label: "8000-8999" },
  { start: 9000, end: 9999, label: "9000-9999" },
]

const mexicanStates = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
]

export function TicketAvailability() {
  const [expandedRange, setExpandedRange] = useState<number | null>(null)
  const [rangeTickets, setRangeTickets] = useState<{ [key: number]: Ticket[] }>({})
  const [rangeStats, setRangeStats] = useState<{ [key: number]: { available: number; total: number } }>({})
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [purchaseForm, setPurchaseForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    state: "",
    promoCode: "",
  })

  // Load stats for all ranges on mount
  useEffect(() => {
    loadAllRangeStats()
  }, [])

  const loadAllRangeStats = async () => {
    const stats: { [key: number]: { available: number; total: number } } = {}

    for (let i = 0; i < TICKET_RANGES.length; i++) {
      const range = TICKET_RANGES[i]
      try {
        const tickets = await getTicketsByRange(range.start, range.end)
        const available = tickets?.filter((t) => t.is_available).length || 0
        const total = tickets?.length || 0
        stats[i] = { available, total }
      } catch (error) {
        console.error(`Error loading stats for range ${range.label}:`, error)
        stats[i] = { available: 0, total: 0 }
      }
    }

    setRangeStats(stats)
  }

  const toggleRange = async (index: number) => {
    if (expandedRange === index) {
      setExpandedRange(null)
      return
    }

    setExpandedRange(index)

    // Load tickets if not already loaded
    if (!rangeTickets[index]) {
      setLoading({ ...loading, [index]: true })
      try {
        const range = TICKET_RANGES[index]
        const tickets = await getTicketsByRange(range.start, range.end)
        setRangeTickets({ ...rangeTickets, [index]: tickets || [] })
      } catch (error) {
        console.error("Error loading tickets:", error)
      } finally {
        setLoading({ ...loading, [index]: false })
      }
    }
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

  const handleFormChange = (field: string, value: string) => {
    setPurchaseForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setShowPurchaseDialog(false)
    setPurchaseForm({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      state: "",
      promoCode: "",
    })
  }

  const handlePayNow = async () => {
    // Validate form
    if (!purchaseForm.firstName || !purchaseForm.lastName || !purchaseForm.phoneNumber || !purchaseForm.state) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    try {
      // Convert selected tickets to numbers
      const ticketNumbers = selectedTickets.map((t) => Number.parseInt(t))
      const totalAmount = selectedTickets.length * 20

      // Create purchase in database
      const purchase = await createPurchaseWithoutAuth({
        ticket_numbers: ticketNumbers,
        total_amount: totalAmount,
      })

      // Generate WhatsApp message
      const ticketId = purchase.ticketId
      const message = `Hola, soy ${purchaseForm.firstName} ${purchaseForm.lastName}

📋 *ID de Reserva:* ${ticketId}

🎫 *Boletos Reservados:* ${selectedTickets.length}
${selectedTickets.slice(0, 20).join(", ")}${selectedTickets.length > 20 ? `... y ${selectedTickets.length - 20} más` : ""}

💰 *Total a Pagar:* $${totalAmount}

📍 *Estado:* ${purchaseForm.state}
📱 *Teléfono:* ${purchaseForm.phoneNumber}

*Pasos para completar tu compra:*
1. Realiza la transferencia bancaria por $${totalAmount}
2. Envía tu comprobante de pago a este número
3. Incluye tu ID de Reserva: ${ticketId}
4. Espera la confirmación (máximo 24 horas)

¡Gracias por tu compra! 🎉`

      // Open WhatsApp
      openWhatsApp("+5212216250235", message)

      // Close dialog and reset
      setShowPurchaseDialog(false)
      alert(`¡Reserva creada! ID: ${ticketId}\n\nTe hemos redirigido a WhatsApp para completar tu pago.`)

      // Reset form and selections
      setPurchaseForm({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        state: "",
        promoCode: "",
      })
      setSelectedTickets([])

      // Reload stats to reflect changes
      loadAllRangeStats()
    } catch (error) {
      console.error("Error creating purchase:", error)
      alert("Error al crear la reserva. Por favor intenta de nuevo.")
    }
  }

  const formatTicketNumber = (num: number) => {
    return String(num).padStart(4, "0")
  }

  const getPercentage = (available: number, total: number) => {
    if (total === 0) return 0
    return Math.round((available / total) * 100)
  }

  return (
    <section id="tickets" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">Boletos Disponibles</h2>
          <p className="text-xl text-muted-foreground">10,000 Boletos Totales - ¡Elige tus números de la suerte!</p>
        </div>

        {selectedTickets.length > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-amber-700 font-semibold">Boletos Seleccionados: {selectedTickets.length}</h4>
                <p className="text-slate-700">Total: ${selectedTickets.length * 20}</p>
              </div>
              <Button
                onClick={() => setShowPurchaseDialog(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Comprar Ahora
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {TICKET_RANGES.map((range, index) => {
            const stats = rangeStats[index] || { available: 0, total: 0 }
            const percentage = getPercentage(stats.available, stats.total)
            const isExpanded = expandedRange === index
            const tickets = rangeTickets[index] || []

            return (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleRange(index)}
                  className="w-full text-left hover:bg-muted/50 transition-colors"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{range.label}</CardTitle>
                        <CardDescription className="text-lg">{stats.available} Disponibles</CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">{percentage}%</div>
                          <div className="text-sm text-muted-foreground">Disponible</div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 pb-6">
                    {loading[index] ? (
                      <div className="text-center py-8 text-muted-foreground">Cargando boletos...</div>
                    ) : (
                      <>
                        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-2">
                          {tickets.map((ticket) => {
                            const ticketNum = formatTicketNumber(ticket.ticket_number)
                            const isSelected = selectedTickets.includes(ticketNum)

                            return (
                              <button
                                key={ticket.id}
                                onClick={() => toggleTicketSelection(ticketNum, ticket.is_available)}
                                disabled={!ticket.is_available}
                                className={`
                                  text-center py-2 px-1 rounded text-sm font-mono transition-all
                                  ${
                                    !ticket.is_available
                                      ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400 line-through cursor-not-allowed"
                                      : isSelected
                                        ? "bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-amber-400 hover:text-white cursor-pointer"
                                  }
                                `}
                                title={
                                  !ticket.is_available
                                    ? "No disponible"
                                    : isSelected
                                      ? "Click para deseleccionar"
                                      : "Click para seleccionar"
                                }
                              >
                                {ticketNum}
                              </button>
                            )
                          })}
                        </div>

                        <div className="flex gap-4 text-sm mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
                            <span className="text-muted-foreground">Disponible</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded"></div>
                            <span className="text-muted-foreground">Seleccionado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <span className="text-muted-foreground">Vendido</span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-2xl bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">Resumen de Boletos a Reservar</DialogTitle>
            <p className="text-slate-600">Revisa los boletos seleccionados y completa el formulario para continuar.</p>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-700 mb-2">{selectedTickets.length} Boletos Seleccionados</h3>
              <div className="text-slate-700">
                <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {selectedTickets.map((ticket) => (
                      <Badge key={ticket} className="bg-amber-500 text-white text-xs">
                        {ticket}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-700">
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  value={purchaseForm.firstName}
                  onChange={(e) => handleFormChange("firstName", e.target.value)}
                  className="bg-slate-50 border-slate-200"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-700">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  value={purchaseForm.lastName}
                  onChange={(e) => handleFormChange("lastName", e.target.value)}
                  className="bg-slate-50 border-slate-200"
                  placeholder="Tu apellido"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-slate-700">
                  Número de Teléfono
                </Label>
                <Input
                  id="phoneNumber"
                  value={purchaseForm.phoneNumber}
                  onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                  className="bg-slate-50 border-slate-200"
                  placeholder="+52 123 456 7890"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-slate-700">
                  Estado
                </Label>
                <select
                  id="state"
                  value={purchaseForm.state}
                  onChange={(e) => handleFormChange("state", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
                >
                  <option value="">Selecciona tu estado</option>
                  {mexicanStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="promoCode" className="text-slate-700">
                  Código Promocional
                </Label>
                <Input
                  id="promoCode"
                  value={purchaseForm.promoCode}
                  onChange={(e) => handleFormChange("promoCode", e.target.value)}
                  className="bg-slate-50 border-slate-200"
                  placeholder="Código opcional"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => alert(`Aplicando código: ${purchaseForm.promoCode}`)}
                  variant="outline"
                  className="border-amber-300 text-amber-600 hover:bg-amber-50 bg-transparent"
                >
                  Aplicar
                </Button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Resumen del Pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Boletos:</span>
                  <span>{selectedTickets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio por boleto:</span>
                  <span>$20.00</span>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-amber-600">${selectedTickets.length * 20}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePayNow}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold"
              >
                Pagar Ahora
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
