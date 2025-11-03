"use client"

import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Zap, Sparkles, Shuffle, ShoppingCart, RefreshCw } from "lucide-react"
import { getTicketsByRange } from "@/lib/database"
import { openWhatsApp } from "@/lib/whatsapp"
import { createPurchaseAction } from "@/app/actions/purchase-actions"
import { useAllTickets, useTicketsByRange } from "@/lib/hooks/use-tickets"
import { mutate as globalMutate } from "swr"

const TicketButton = memo(
  ({
    ticket,
    isSelected,
    onToggle,
  }: {
    ticket: { number: string; available: boolean }
    isSelected: boolean
    onToggle: (ticketNumber: string, isAvailable: boolean) => void
  }) => {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`
          h-11 sm:h-10
          min-h-[44px] sm:min-h-[40px]
          text-xs sm:text-xs 
          font-semibold
          transition-none
          touch-manipulation
          ${
            !ticket.available
              ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed opacity-50"
              : isSelected
                ? "bg-blue-500 text-white border-blue-500 shadow-md"
                : "border-slate-300 text-slate-700 bg-white hover:bg-blue-50 hover:border-blue-300"
          }
        `}
        onClick={() => onToggle(ticket.number, ticket.available)}
        disabled={!ticket.available}
        style={{
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {ticket.number}
      </Button>
    )
  },
)

TicketButton.displayName = "TicketButton"

const ticketPackages = [
  {
    id: 1,
    tickets: 10,
    price: 200,
    originalPrice: 250,
    popular: true,
    icon: Star,
    color: "from-amber-400 to-amber-500",
  },
  {
    id: 2,
    tickets: 15,
    price: 325,
    originalPrice: 375,
    popular: false,
    icon: Zap,
    color: "from-emerald-400 to-emerald-500",
  },
  {
    id: 3,
    tickets: 20,
    price: 400,
    originalPrice: 500,
    popular: false,
    icon: Sparkles,
    color: "from-rose-400 to-rose-500",
  },
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

export function TicketPackages() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [assignedPackageTickets, setAssignedPackageTickets] = useState<string[]>([])
  const [luckyNumberAmount, setLuckyNumberAmount] = useState("")
  const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([])
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [showLuckyDialog, setShowLuckyDialog] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [openSectionDialog, setOpenSectionDialog] = useState<number | null>(null)
  const [ticketData, setTicketData] = useState<Record<number, any[]>>({})
  const [loadingTickets, setLoadingTickets] = useState<Record<number, boolean>>({})
  const [purchaseForm, setPurchaseForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    state: "",
    promoCode: "",
  })

  const {
    sectionCounts,
    totalAvailable,
    isLoading: isLoadingAllTickets,
    mutate: refreshAllTickets,
    tickets,
  } = useAllTickets()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sectionParam = urlParams.get("section")

    if (sectionParam !== null) {
      const sectionIndex = Number.parseInt(sectionParam)
      if (sectionIndex >= 0 && sectionIndex <= 9) {
        setOpenSectionDialog(sectionIndex)
        window.history.replaceState({}, "", window.location.pathname)
      }
    }
  }, [])

  useEffect(() => {
    if (openSectionDialog !== null && !ticketData[openSectionDialog]) {
      fetchTicketsForSection(openSectionDialog)
    }
  }, [openSectionDialog])

  const fetchTicketsForSection = async (sectionIndex: number) => {
    setLoadingTickets((prev) => ({ ...prev, [sectionIndex]: true }))
    try {
      const startNum = sectionIndex * 1000
      const endNum = startNum + 999
      const tickets = await getTicketsByRange(startNum, endNum)
      setTicketData((prev) => ({ ...prev, [sectionIndex]: tickets }))
    } catch (error) {
      console.error("[v0] Error fetching tickets:", error)
    } finally {
      setLoadingTickets((prev) => ({ ...prev, [sectionIndex]: false }))
    }
  }

  const allAvailableTickets = tickets
    .filter((ticket) => ticket.is_available)
    .map((ticket) => ticket.ticket_number.toString().padStart(4, "0"))

  const handlePackageSelect = (packageId: number) => {
    setSelectedPackage(packageId)
    const pkg = ticketPackages.find((p) => p.id === packageId)
    if (pkg) {
      const availableForSelection = allAvailableTickets.filter((ticket) => !selectedTickets.includes(ticket))

      if (availableForSelection.length < pkg.tickets) {
        alert(
          `Solo hay ${availableForSelection.length} boletos disponibles. No se pueden asignar ${pkg.tickets} boletos.`,
        )
        return
      }

      const assignedTickets = selectRandomAvailableTickets(pkg.tickets, availableForSelection)
      setAssignedPackageTickets(assignedTickets)
      setSelectedTickets(assignedTickets)
    }
  }

  const handleBuyNow = () => {
    setShowPurchaseDialog(true)
  }

  const handleFormChange = (field: string, value: string) => {
    setPurchaseForm((prev) => ({ ...prev, [field]: value }))
  }

  const applyPromoCode = () => {
    alert(`Aplicando código promocional: ${purchaseForm.promoCode}`)
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
    console.log("[v0] ========== CLIENT: PURCHASE FLOW START ==========")
    console.log("[v0] Validating form fields...")

    if (!purchaseForm.firstName || !purchaseForm.lastName || !purchaseForm.phoneNumber || !purchaseForm.state) {
      console.error("[v0] CLIENT ERROR: Missing required form fields")
      console.error("[v0] Form state:", {
        firstName: !!purchaseForm.firstName,
        lastName: !!purchaseForm.lastName,
        phoneNumber: !!purchaseForm.phoneNumber,
        state: !!purchaseForm.state,
      })
      alert("Por favor completa todos los campos requeridos")
      return
    }

    console.log("[v0] ✓ Form validation passed")

    try {
      const ticketNumbers = selectedTickets.map((t) => Number.parseInt(t))
      const totalAmount = selectedPackage ? getSelectedPackageInfo()?.price || 0 : selectedTickets.length * 20

      console.log("[v0] Purchase details:")
      console.log("[v0] - Selected tickets count:", selectedTickets.length)
      console.log("[v0] - First 10 tickets:", selectedTickets.slice(0, 10))
      console.log("[v0] - Ticket numbers (parsed):", ticketNumbers.slice(0, 10), "... (showing first 10)")
      console.log("[v0] - Total amount:", totalAmount)
      console.log("[v0] - Buyer name:", `${purchaseForm.firstName} ${purchaseForm.lastName}`)
      console.log("[v0] - Buyer phone:", purchaseForm.phoneNumber)
      console.log("[v0] - Buyer state:", purchaseForm.state)
      console.log("[v0] - Selected package:", selectedPackage)

      console.log("[v0] Calling createPurchaseAction...")

      const result = await createPurchaseAction({
        ticketNumbers,
        totalAmount,
        buyerName: `${purchaseForm.firstName} ${purchaseForm.lastName}`,
        buyerPhone: purchaseForm.phoneNumber,
        buyerState: purchaseForm.state,
      })

      console.log("[v0] Received response from createPurchaseAction:")
      console.log("[v0] - Success:", result.success)
      console.log("[v0] - Result:", JSON.stringify(result, null, 2))

      if (!result.success) {
        console.error("[v0] CLIENT ERROR: Purchase action failed")
        console.error("[v0] Error message:", result.error)
        throw new Error(result.error || "Error desconocido")
      }

      const purchase = result.purchase
      console.log("[v0] ✓ Purchase created successfully!")
      console.log("[v0] Purchase ID:", purchase.id)
      console.log("[v0] Purchase status:", purchase.status)

      const ticketId = purchase.reservation_id
      console.log("[v0] Using server reservation ID:", ticketId)

      let ticketsList = ""
      if (selectedTickets.length <= 25) {
        ticketsList = selectedTickets.join(", ")
      } else {
        ticketsList = `${selectedTickets.slice(0, 25).join(", ")}

📝 *Nota:* Tienes más de 25 boletos. Para ver la lista completa de tus boletos, usa la opción "Verificar Boletos" en nuestra página web con tu ID de Reserva.`
      }

      const websiteUrl = window.location.origin
      const verifyTicketsUrl = `${websiteUrl}/verify-tickets`

      const message = `🌐 *Sitio Web:* ${websiteUrl}

Hola, soy ${purchaseForm.firstName} ${purchaseForm.lastName}

📋 *ID de Reserva:* ${ticketId}

🎫 *Boletos Reservados:* ${selectedTickets.length}
${ticketsList}

💰 *Total a Pagar:* $${totalAmount} MXN

📍 *Estado:* ${purchaseForm.state}
📱 *Teléfono:* ${purchaseForm.phoneNumber}

*Pasos para completar tu compra:*
1️⃣ Realiza la transferencia bancaria por $${totalAmount} MXN
2️⃣ Envía tu comprobante de pago a este número
3️⃣ Incluye tu ID de Reserva: ${ticketId}
4️⃣ Espera la confirmación (máximo 24 horas)

⚠️ *Importante:* Tus boletos están reservados por 24 horas. Si no recibes el pago en ese tiempo, la reserva será cancelada.

🔍 *Verificar Boletos:* ${verifyTicketsUrl}
Usa este enlace para verificar tus boletos en cualquier momento con tu ID de Reserva.

¡Gracias por tu compra! 🎉`

      console.log("[v0] Opening WhatsApp with message...")
      openWhatsApp("+5212216250235", message)

      setShowPurchaseDialog(false)
      alert(
        `¡Reserva creada exitosamente! 🎉\n\nID: ${ticketId}\n\nTus boletos han sido reservados.\nTe hemos redirigido a WhatsApp para completar tu pago.\n\n💡 Guarda tu ID de Reserva para verificar tus boletos más tarde.`,
      )

      console.log("[v0] Resetting form and selections...")
      setPurchaseForm({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        state: "",
        promoCode: "",
      })
      setSelectedTickets([])
      setSelectedPackage(null)
      setAssignedPackageTickets([])

      console.log("[v0] Invalidating all ticket caches...")

      // Refresh the main tickets list
      refreshAllTickets()

      // Invalidate all ticket-range caches (for all section dialogs)
      await globalMutate((key) => Array.isArray(key) && key[0] === "tickets-range", undefined, { revalidate: true })

      console.log("[v0] All caches invalidated successfully")
      console.log("[v0] Reloading page...")
      console.log("[v0] ========== CLIENT: PURCHASE FLOW SUCCESS ==========")

      window.location.reload()
    } catch (error) {
      console.error("[v0] ========== CLIENT: PURCHASE FLOW FAILED ==========")
      console.error("[v0] Error creating purchase:", error)

      let errorMessage = "Error al crear la reserva. Por favor intenta de nuevo."

      if (error instanceof Error) {
        console.error("[v0] Error type:", error.name)
        console.error("[v0] Error message:", error.message)
        console.error("[v0] Error stack:", error.stack)
        errorMessage = `Error: ${error.message}`
      }

      console.error("[v0] Showing error to user:", errorMessage)
      console.error("[v0] ========================================")

      alert(errorMessage)
    }
  }

  const generateLuckyNumbers = () => {
    const amount = Number.parseInt(luckyNumberAmount) || 0
    if (amount <= 0 || amount > 1000) return

    const availableForSelection = allAvailableTickets.filter((ticket) => !selectedTickets.includes(ticket))

    if (availableForSelection.length < amount) {
      alert(`Solo hay ${availableForSelection.length} boletos disponibles. No se pueden generar ${amount} boletos.`)
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const numbers = selectRandomAvailableTickets(amount, availableForSelection)

      setSelectedPackage(null)
      setAssignedPackageTickets([])

      setGeneratedNumbers(numbers)
      setSelectedTickets(numbers)
      setIsGenerating(false)
    }, 3000)
  }

  const toggleTicketSelection = (ticketNumber: string, isAvailable: boolean) => {
    if (!isAvailable) {
      alert("Este boleto ya no está disponible")
      return
    }

    if (selectedTickets.includes(ticketNumber)) {
      setSelectedTickets((prev) => prev.filter((t) => t !== ticketNumber))
    } else {
      setSelectedTickets((prev) => [...prev, ticketNumber])
    }
  }

  const handlePurchaseFromTable = (sectionTickets: string[]) => {
    const selectedFromSection = selectedTickets.filter((ticket) => sectionTickets.includes(ticket))
    if (selectedFromSection.length > 0) {
      setShowPurchaseDialog(true)
    }
  }

  const getSelectedPackageInfo = () => {
    return ticketPackages.find((pkg) => pkg.id === selectedPackage)
  }

  const handleSaveAndBuyLucky = () => {
    setShowLuckyDialog(false)
    setShowPurchaseDialog(true)
  }

  const selectRandomAvailableTickets = (count: number, availablePool: string[]): string[] => {
    const shuffled = [...availablePool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, count)
    return selected
  }

  return (
    <div className="space-y-8">
      <style jsx>{`
        @keyframes rainbow-glow {
          0% { box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000; }
          16.66% { box-shadow: 0 0 20px #ff8000, 0 0 40px #ff8000, 0 0 60px #ff8000; }
          33.33% { box-shadow: 0 0 20px #ffff00, 0 0 40px #ffff00, 0 0 60px #ffff00; }
          50% { box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00; }
          66.66% { box-shadow: 0 0 20px #0080ff, 0 0 40px #0080ff, 0 0 60px #0080ff; }
          83.33% { box-shadow: 0 0 20px #8000ff, 0 0 40px #8000ff, 0 0 60px #8000ff; }
          100% { box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000; }
        }
        
        @keyframes slot-spin {
          0% { transform: rotateY(0deg); }
          25% { transform: rotateY(90deg); }
          50% { transform: rotateY(180deg); }
          75% { transform: rotateY(270deg); }
          100% { transform: rotateY(360deg); }
        }
        
        .rainbow-glow {
          animation: rainbow-glow 2s linear infinite;
          border: 3px solid transparent;
          background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0000);
          background-size: 400% 400%;
          animation: rainbow-glow 2s linear infinite, gradient-shift 3s ease infinite;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .slot-animation {
          animation: slot-spin 0.5s linear infinite;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ticketPackages.map((pkg) => {
          const IconComponent = pkg.icon
          const savings = pkg.originalPrice - pkg.price

          return (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 cursor-pointer bg-white shadow-lg ${
                selectedPackage === pkg.id
                  ? "border-amber-500 shadow-xl shadow-amber-200"
                  : "border-slate-200 hover:border-amber-300"
              } ${pkg.popular ? "ring-2 ring-amber-400" : ""}`}
              onClick={() => handlePackageSelect(pkg.id)}
            >
              {pkg.popular && (
                <Badge className="absolute top-2 right-2 bg-amber-500 text-white font-semibold">Más Popular</Badge>
              )}

              <CardHeader className={`bg-gradient-to-r ${pkg.color} text-white`}>
                <div className="flex items-center justify-between">
                  <IconComponent className="h-8 w-8" />
                  <div className="text-right">
                    <CardTitle className="text-2xl font-bold">{pkg.tickets}</CardTitle>
                    <CardDescription className="text-white/90">Boletos</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 bg-white">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-amber-600">${pkg.price}</span>
                    {pkg.id >= 2 && (
                      <div className="text-right">
                        <div className="text-sm text-slate-400 line-through">${pkg.originalPrice}</div>
                        <div className="text-sm text-emerald-600">Ahorra ${savings}</div>
                      </div>
                    )}
                  </div>
                  {pkg.id >= 2 && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      {Math.round((savings / pkg.originalPrice) * 100)}% DESC
                    </Badge>
                  )}
                  <p className="text-sm text-slate-500">${(pkg.price / pkg.tickets).toFixed(2)} por boleto</p>

                  {selectedPackage === pkg.id && assignedPackageTickets.length > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm font-semibold text-amber-700 mb-2">Tus Boletos Asignados:</p>
                      <div className="flex flex-wrap gap-1">
                        {assignedPackageTickets.slice(0, 6).map((ticket) => (
                          <Badge key={ticket} variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                            {ticket}
                          </Badge>
                        ))}
                        {assignedPackageTickets.length > 6 && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                            +{assignedPackageTickets.length - 6} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 bg-white">
                <Button
                  className={`w-full transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-700 border border-slate-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (selectedPackage === pkg.id) {
                      handleBuyNow()
                    } else {
                      handlePackageSelect(pkg.id)
                    }
                  }}
                  disabled={isLoadingAllTickets}
                >
                  {isLoadingAllTickets
                    ? "Cargando..."
                    : selectedPackage === pkg.id
                      ? "Comprar Ahora"
                      : "Seleccionar Paquete"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="text-center px-4">
        <Dialog open={showLuckyDialog} onOpenChange={setShowLuckyDialog}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rainbow-glow text-white font-bold px-6 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8 text-base sm:text-xl md:text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden w-full sm:w-auto"
              style={{
                background: "linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0000)",
                backgroundSize: "400% 400%",
              }}
              data-lucky-numbers-trigger
              disabled={isLoadingAllTickets}
            >
              <Shuffle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 mr-2 sm:mr-4" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {isLoadingAllTickets ? "CARGANDO..." : "💰 MÁQUINA DE LA SUERTE 💰"}
              </span>
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ml-2 sm:ml-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-[95vw] sm:max-w-md bg-white border-slate-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-slate-800 mb-4">
                🎰 Generador de Números de la Suerte 🎰
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label htmlFor="lucky-amount" className="text-slate-700 text-base sm:text-lg font-semibold">
                  ¿Cuántos boletos quieres generar?
                </Label>
                <Input
                  id="lucky-amount"
                  type="number"
                  min="1"
                  max={Math.min(1000, totalAvailable)}
                  value={luckyNumberAmount}
                  onChange={(e) => setLuckyNumberAmount(e.target.value)}
                  placeholder="Máximo 1,000 por intento"
                  className="mt-2 bg-slate-50 border-slate-200 text-slate-700 focus:border-amber-400 text-base sm:text-lg p-3 sm:p-4"
                />
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Máximo 1,000 boletos por intento ({totalAvailable} disponibles)
                </p>
              </div>

              {isGenerating && (
                <div className="text-center py-8">
                  <div className="text-5xl sm:text-6xl slot-animation mb-4">🎰</div>
                  <div className="text-lg sm:text-xl font-bold text-amber-600 mb-2">
                    Generando Números de la Suerte...
                  </div>
                  <div className="text-sm sm:text-base text-slate-600">🍀 ¡La buena suerte viene en camino! 🍀</div>
                </div>
              )}

              {generatedNumbers.length > 0 && !isGenerating && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl mb-2">🎉 ¡Tus Números de la Suerte! 🎉</div>
                    <div className="bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-lg max-h-40 overflow-y-auto">
                      <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                        {generatedNumbers.map((number) => (
                          <Badge key={number} className="bg-amber-500 text-white text-sm sm:text-lg px-2 sm:px-3 py-1">
                            {number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="text-base sm:text-lg font-semibold text-slate-800">
                      Total: {generatedNumbers.length} boletos
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-amber-600">
                      Precio: ${generatedNumbers.length * 20}
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveAndBuyLucky}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 text-base sm:text-lg"
                  >
                    Guardar y Comprar Ahora 🛒
                  </Button>
                </div>
              )}

              {!isGenerating && generatedNumbers.length === 0 && (
                <Button
                  onClick={generateLuckyNumbers}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 sm:py-4 text-base sm:text-lg"
                  disabled={!luckyNumberAmount || Number.parseInt(luckyNumberAmount) <= 0 || isLoadingAllTickets}
                >
                  <Shuffle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  ¡Generar Números de la Suerte! 🎲
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Números de <span className="text-amber-600">Boletos Disponibles</span>
          </h2>
          <p className="text-slate-600">10,000 boletos disponibles - ¡Elige tus números de la suerte!</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshAllTickets()}
            className="mt-2 border-amber-300 text-amber-600 hover:bg-amber-50"
            disabled={isLoadingAllTickets}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAllTickets ? "animate-spin" : ""}`} />
            Actualizar Disponibilidad
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, i) => {
            const startNum = i * 1000
            const endNum = startNum + 999
            const sectionTickets = ticketData[i] || []
            const sectionInfo = sectionCounts.find((s) => s.section === i)
            const availableTickets = sectionInfo?.available ?? 0
            const isSoldOut = availableTickets === 0

            return (
              <Dialog
                key={i}
                open={openSectionDialog === i}
                onOpenChange={(open) => {
                  if (!open) setOpenSectionDialog(null)
                  else if (!isSoldOut) setOpenSectionDialog(i)
                }}
              >
                <DialogTrigger asChild>
                  <Card
                    className={`bg-slate-50 border-slate-200 transition-all duration-300 shadow-md ${
                      isSoldOut
                        ? "opacity-60 cursor-not-allowed border-red-300 bg-red-50"
                        : "hover:border-amber-400 cursor-pointer hover:scale-105 hover:shadow-lg"
                    }`}
                    data-section={i}
                    onClick={() => {
                      if (!isSoldOut) setOpenSectionDialog(i)
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-slate-700 text-center">
                        {startNum.toString().padStart(4, "0")} - {endNum.toString().padStart(4, "0")}
                      </CardTitle>
                      {isSoldOut && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white font-bold text-xs">
                          AGOTADO
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">
                          {isLoadingAllTickets ? (
                            <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                          ) : (
                            availableTickets
                          )}
                        </div>
                        <div className={`text-sm ${isSoldOut ? "text-red-600 font-semibold" : "text-slate-500"}`}>
                          {isSoldOut ? "Sin Disponibilidad" : "Disponibles"}
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isSoldOut ? "bg-red-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${(availableTickets / 1000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Actualizado en tiempo real</div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-[100vw] sm:max-w-4xl max-h-[90vh] sm:max-h-[80vh] bg-white border-slate-200 p-4 sm:p-6">
                  <SectionDialogContent
                    sectionIndex={i}
                    startNum={startNum}
                    endNum={endNum}
                    selectedTickets={selectedTickets}
                    toggleTicketSelection={toggleTicketSelection}
                    handlePurchaseFromTable={handlePurchaseFromTable}
                  />
                </DialogContent>
              </Dialog>
            )
          })}
        </div>
      </div>

      {selectedTickets.length > 0 && !selectedPackage && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-amber-300 shadow-2xl p-3 sm:p-4 md:relative md:border-0 md:shadow-none md:text-center md:space-y-4 md:mt-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 md:block">
            {/* Summary info */}
            <div className="flex items-center gap-3 sm:gap-4 md:bg-amber-50 md:border md:border-amber-200 md:p-4 md:rounded-lg md:mb-4 md:block">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-600 md:hidden" />
                <div className="text-left md:text-center">
                  <h4 className="text-amber-700 font-semibold text-sm sm:text-base md:mb-2">
                    Boletos: {selectedTickets.length}
                  </h4>
                  <p className="text-slate-700 text-xs sm:text-sm md:text-base">
                    Total: ${selectedTickets.length * 20}
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <Button
              size="lg"
              className="
                bg-gradient-to-r from-amber-500 to-amber-600 
                hover:from-amber-600 hover:to-amber-700 
                active:from-amber-700 active:to-amber-800
                text-white font-bold 
                shadow-lg
                transition-all duration-100
                active:scale-[0.98]
                touch-manipulation
                h-12 sm:h-13 md:h-auto
                text-sm sm:text-base md:text-lg
                px-4 sm:px-8 md:px-12
                py-3 md:py-4
                flex-shrink-0
                whitespace-nowrap
              "
              onClick={() => setShowPurchaseDialog(true)}
              style={{
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Guardar y Comprar Boletos</span>
              <span className="sm:hidden">Comprar ({selectedTickets.length})</span>
            </Button>
          </div>
        </div>
      )}

      {selectedTickets.length > 0 && !selectedPackage && <div className="h-24 md:hidden" aria-hidden="true"></div>}

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-4">
              Resumen de Boletos a Reservar
            </DialogTitle>
            <p className="text-sm sm:text-base text-slate-600">
              Revisa los boletos seleccionados y completa el formulario para continuar.
            </p>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-amber-700 mb-2 text-sm sm:text-base">
                {selectedPackage
                  ? `${getSelectedPackageInfo()?.tickets} Boletos Seleccionados`
                  : `${selectedTickets.length} Boletos Seleccionados`}
              </h3>
              {selectedPackage && assignedPackageTickets.length > 0 && (
                <div className="text-slate-700">
                  <p className="mb-2 text-sm">Paquete de {getSelectedPackageInfo()?.tickets} boletos</p>
                  <div className="bg-white p-2 sm:p-3 rounded border">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Números asignados:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignedPackageTickets.map((ticket) => (
                        <Badge key={ticket} className="bg-amber-500 text-white text-xs">
                          {ticket}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {selectedTickets.length > 0 && !selectedPackage && (
                <div className="text-slate-700 text-sm">
                  <p>
                    Boletos individuales: {selectedTickets.slice(0, 10).join(", ")}
                    {selectedTickets.length > 10 && ` y ${selectedTickets.length - 10} más...`}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-700 text-sm">
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  value={purchaseForm.firstName}
                  onChange={(e) => handleFormChange("firstName", e.target.value)}
                  className="bg-slate-50 border-slate-200 h-10"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-700 text-sm">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  value={purchaseForm.lastName}
                  onChange={(e) => handleFormChange("lastName", e.target.value)}
                  className="bg-slate-50 border-slate-200 h-10"
                  placeholder="Tu apellido"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-slate-700 text-sm">
                  Número de Teléfono
                </Label>
                <Input
                  id="phoneNumber"
                  value={purchaseForm.phoneNumber}
                  onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                  className="bg-slate-50 border-slate-200 h-10"
                  placeholder="123 456 7890"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-slate-700 text-sm">
                  Estado
                </Label>
                <select
                  id="state"
                  value={purchaseForm.state}
                  onChange={(e) => handleFormChange("state", e.target.value)}
                  className="w-full h-10 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm"
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
                <Label htmlFor="promoCode" className="text-slate-700 text-sm">
                  Código Promocional
                </Label>
                <Input
                  id="promoCode"
                  value={purchaseForm.promoCode}
                  onChange={(e) => handleFormChange("promoCode", e.target.value)}
                  className="bg-slate-50 border-slate-200 h-10"
                  placeholder="Código opcional"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={applyPromoCode}
                  variant="outline"
                  className="border-amber-300 text-amber-600 hover:bg-amber-50 bg-transparent h-10 text-sm"
                >
                  Aplicar
                </Button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Resumen del Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Boletos:</span>
                  <span>{selectedPackage ? getSelectedPackageInfo()?.tickets : selectedTickets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio por boleto:</span>
                  <span>
                    $
                    {selectedPackage
                      ? (getSelectedPackageInfo()?.price! / getSelectedPackageInfo()?.tickets!).toFixed(2)
                      : "20.00"}
                  </span>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Total:</span>
                    <span className="text-amber-600">
                      ${selectedPackage ? getSelectedPackageInfo()?.price : selectedTickets.length * 20}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent h-12 sm:h-10 text-sm sm:text-base"
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePayNow}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold h-12 sm:h-10 text-sm sm:text-base"
              >
                Pagar Ahora
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SectionDialogContent({
  sectionIndex,
  startNum,
  endNum,
  selectedTickets,
  toggleTicketSelection,
  handlePurchaseFromTable,
}: {
  sectionIndex: number
  startNum: number
  endNum: number
  selectedTickets: string[]
  toggleTicketSelection: (ticketNumber: string, isAvailable: boolean) => void
  handlePurchaseFromTable: (sectionTickets: string[]) => void
}) {
  const { tickets, availableCount, isLoading } = useTicketsByRange(startNum, endNum, true)

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
    <>
      <DialogHeader>
        <DialogTitle className="text-amber-600 text-lg sm:text-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-base sm:text-lg">
            Boletos {startNum.toString().padStart(4, "0")} - {endNum.toString().padStart(4, "0")}
          </span>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs sm:text-sm">
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
          <div className="overflow-y-auto max-h-[30vh] sm:max-h-[45vh] md:max-h-[55vh] pb-2">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2 p-2 sm:p-4">
              {ticketNumbers.map((ticket) => (
                <TicketButton
                  key={ticket.number}
                  ticket={ticket}
                  isSelected={selectedTickets.includes(ticket.number)}
                  onToggle={toggleTicketSelection}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2 pt-2 border-t border-slate-200 bg-white">
            {/* Legend - more compact on mobile */}
            <div className="flex flex-wrap gap-1.5 sm:gap-3 text-[10px] sm:text-xs justify-center px-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 border border-slate-300 bg-white rounded"></div>
                <span className="text-slate-600">Disponible</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded"></div>
                <span className="text-slate-600">Seleccionado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded"></div>
                <span className="text-slate-600">Vendido</span>
              </div>
            </div>

            {/* Button section - always visible */}
            <div className="flex flex-col gap-1.5 sm:gap-2 px-2 pb-2">
              <p className="text-amber-600 font-semibold text-xs sm:text-sm text-center">
                {availableCount} disponibles
              </p>
              {selectedInSection.length > 0 && (
                <Button
                  onClick={() => handlePurchaseFromTable(ticketNumbers.map((t) => t.number))}
                  className="
                    bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700
                    text-white font-bold
                    w-full
                    h-12 sm:h-11
                    min-h-[48px] sm:min-h-[44px]
                    text-sm sm:text-base
                    shadow-lg
                    transition-all duration-100
                    active:scale-[0.98]
                    touch-manipulation
                    px-3
                  "
                  style={{
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Comprar ({selectedInSection.length})</span>
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
