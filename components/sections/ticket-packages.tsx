"use client"

import { useState, useEffect } from "react"
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

  const { sectionCounts, isLoading: isLoadingAllTickets, mutate: refreshAllTickets } = useAllTickets()

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

  const handlePackageSelect = (packageId: number) => {
    setSelectedPackage(packageId)
    const pkg = ticketPackages.find((p) => p.id === packageId)
    if (pkg) {
      const assignedTickets = generateConsecutiveTickets(pkg.tickets)
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
    // Validate form
    if (!purchaseForm.firstName || !purchaseForm.lastName || !purchaseForm.phoneNumber || !purchaseForm.state) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    try {
      const ticketNumbers = selectedTickets.map((t) => Number.parseInt(t))
      const totalAmount = selectedPackage ? getSelectedPackageInfo()?.price || 0 : selectedTickets.length * 20

      console.log("[v0] Starting purchase process...")
      console.log("[v0] Ticket numbers:", ticketNumbers)
      console.log("[v0] Total amount:", totalAmount)

      const result = await createPurchaseAction({
        ticketNumbers,
        totalAmount,
      })

      if (!result.success) {
        throw new Error(result.error || "Error desconocido")
      }

      const purchase = result.purchase
      console.log("[v0] Purchase created successfully:", purchase)

      const ticketId = `TKT-${purchase.id.slice(0, 8).toUpperCase()}`

      const message = `Hola, soy ${purchaseForm.firstName} ${purchaseForm.lastName}

📋 *ID de Reserva:* ${ticketId}

🎫 *Boletos Reservados:* ${selectedTickets.length}
${selectedTickets.slice(0, 20).join(", ")}${selectedTickets.length > 20 ? `... y ${selectedTickets.length - 20} más` : ""}

💰 *Total a Pagar:* $${totalAmount} MXN

📍 *Estado:* ${purchaseForm.state}
📱 *Teléfono:* ${purchaseForm.phoneNumber}

*Pasos para completar tu compra:*
1️⃣ Realiza la transferencia bancaria por $${totalAmount} MXN
2️⃣ Envía tu comprobante de pago a este número
3️⃣ Incluye tu ID de Reserva: ${ticketId}
4️⃣ Espera la confirmación (máximo 24 horas)

⚠️ *Importante:* Tus boletos están reservados por 24 horas. Si no recibes el pago en ese tiempo, la reserva será cancelada.

¡Gracias por tu compra! 🎉`

      openWhatsApp("+5212216250235", message)

      setShowPurchaseDialog(false)
      alert(
        `¡Reserva creada exitosamente! 🎉\n\nID: ${ticketId}\n\nTus boletos han sido reservados.\nTe hemos redirigido a WhatsApp para completar tu pago.`,
      )

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

      refreshAllTickets()
      if (openSectionDialog !== null) {
        fetchTicketsForSection(openSectionDialog)
      }

      window.location.reload()
    } catch (error) {
      console.error("[v0] Error creating purchase:", error)

      let errorMessage = "Error al crear la reserva. Por favor intenta de nuevo."

      if (error instanceof Error) {
        console.error("[v0] Error details:", error.message)
        errorMessage = `Error: ${error.message}`
      }

      alert(errorMessage)
    }
  }

  const generateLuckyNumbers = () => {
    const amount = Number.parseInt(luckyNumberAmount) || 0
    if (amount <= 0 || amount > 10000) return

    setIsGenerating(true)

    setTimeout(() => {
      const numbers = new Set<string>()
      while (numbers.size < amount) {
        const randomNum = Math.floor(Math.random() * 10000)
        numbers.add(randomNum.toString().padStart(4, "0"))
      }

      setSelectedPackage(null)
      setAssignedPackageTickets([])

      setGeneratedNumbers(Array.from(numbers))
      setSelectedTickets(Array.from(numbers))
      setIsGenerating(false)
    }, 3000)
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

  const generateConsecutiveTickets = (count: number): string[] => {
    const startNumber = Math.floor(Math.random() * (10000 - count))
    const tickets = []
    for (let i = 0; i < count; i++) {
      tickets.push((startNumber + i).toString().padStart(4, "0"))
    }
    return tickets
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
                    <div className="text-right">
                      <div className="text-sm text-slate-400 line-through">${pkg.originalPrice}</div>
                      <div className="text-sm text-emerald-600">Ahorra ${savings}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    {Math.round((savings / pkg.originalPrice) * 100)}% DESC
                  </Badge>
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
                >
                  {selectedPackage === pkg.id ? "Comprar Ahora" : "Seleccionar Paquete"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <Dialog open={showLuckyDialog} onOpenChange={setShowLuckyDialog}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rainbow-glow text-white font-bold px-16 py-8 text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              style={{
                background: "linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0000)",
                backgroundSize: "400% 400%",
              }}
              data-lucky-numbers-trigger
            >
              <Shuffle className="h-8 w-8 mr-4" />💰 MÁQUINA DE LA SUERTE 💰
              <Sparkles className="h-8 w-8 ml-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-white border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-slate-800 mb-4">
                🎰 Generador de Números de la Suerte 🎰
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label htmlFor="lucky-amount" className="text-slate-700 text-lg font-semibold">
                  ¿Cuántos boletos quieres generar?
                </Label>
                <Input
                  id="lucky-amount"
                  type="number"
                  min="1"
                  max="10000"
                  value={luckyNumberAmount}
                  onChange={(e) => setLuckyNumberAmount(e.target.value)}
                  placeholder="Ingresa el número de boletos"
                  className="mt-2 bg-slate-50 border-slate-200 text-slate-700 focus:border-amber-400 text-lg p-4"
                />
              </div>

              {isGenerating && (
                <div className="text-center py-8">
                  <div className="text-6xl slot-animation mb-4">🎰</div>
                  <div className="text-xl font-bold text-amber-600 mb-2">Generando Números de la Suerte...</div>
                  <div className="text-slate-600">🍀 ¡La buena suerte viene en camino! 🍀</div>
                </div>
              )}

              {generatedNumbers.length > 0 && !isGenerating && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎉 ¡Tus Números de la Suerte! 🎉</div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg max-h-40 overflow-y-auto">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {generatedNumbers.map((number) => (
                          <Badge key={number} className="bg-amber-500 text-white text-lg px-3 py-1">
                            {number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="text-lg font-semibold text-slate-800">Total: {generatedNumbers.length} boletos</div>
                    <div className="text-xl font-bold text-amber-600">Precio: ${generatedNumbers.length * 20}</div>
                  </div>

                  <Button
                    onClick={handleSaveAndBuyLucky}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 text-lg"
                  >
                    Guardar y Comprar Ahora 🛒
                  </Button>
                </div>
              )}

              {!isGenerating && generatedNumbers.length === 0 && (
                <Button
                  onClick={generateLuckyNumbers}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 text-lg"
                  disabled={!luckyNumberAmount || Number.parseInt(luckyNumberAmount) <= 0}
                >
                  <Shuffle className="h-6 w-6 mr-2" />
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
            const availableTickets = sectionInfo?.available || 1000

            return (
              <Dialog
                key={i}
                open={openSectionDialog === i}
                onOpenChange={(open) => {
                  if (!open) setOpenSectionDialog(null)
                  else setOpenSectionDialog(i)
                }}
              >
                <DialogTrigger asChild>
                  <Card
                    className="bg-slate-50 border-slate-200 hover:border-amber-400 transition-all duration-300 cursor-pointer hover:scale-105 shadow-md hover:shadow-lg"
                    data-section={i}
                    onClick={() => setOpenSectionDialog(i)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-slate-700 text-center">
                        {startNum.toString().padStart(4, "0")} - {endNum.toString().padStart(4, "0")}
                      </CardTitle>
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
                        <div className="text-sm text-slate-500">Disponibles</div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(availableTickets / 1000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Actualizado en tiempo real</div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[80vh] bg-white border-slate-200">
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
        <div className="text-center space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h4 className="text-amber-700 font-semibold mb-2">Boletos Seleccionados: {selectedTickets.length}</h4>
            <p className="text-slate-700">Total: ${selectedTickets.length * 20}</p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-12 py-4 text-lg shadow-lg"
            onClick={() => setShowPurchaseDialog(true)}
          >
            Guardar y Comprar Boletos Seleccionados
          </Button>
        </div>
      )}

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-2xl bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">Resumen de Boletos a Reservar</DialogTitle>
            <p className="text-slate-600">Revisa los boletos seleccionados y completa el formulario para continuar.</p>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-700 mb-2">
                {selectedPackage
                  ? `${getSelectedPackageInfo()?.tickets} Boletos Seleccionados`
                  : `${selectedTickets.length} Boletos Seleccionados`}
              </h3>
              {selectedPackage && assignedPackageTickets.length > 0 && (
                <div className="text-slate-700">
                  <p className="mb-2">Paquete de {getSelectedPackageInfo()?.tickets} boletos</p>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm font-medium text-slate-600 mb-2">Números asignados:</p>
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
                <div className="text-slate-700">
                  <p>
                    Boletos individuales: {selectedTickets.slice(0, 10).join(", ")}
                    {selectedTickets.length > 10 && ` y ${selectedTickets.length - 10} más...`}
                  </p>
                </div>
              )}
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
                  onClick={applyPromoCode}
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
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-amber-600">
                      ${selectedPackage ? getSelectedPackageInfo()?.price : selectedTickets.length * 20}
                    </span>
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
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold"
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

    // Fallback to generating all tickets if no data
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

  return (
    <>
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
              <p className="text-amber-600 font-semibold">{availableCount} boletos disponibles</p>
              {selectedTickets.filter((ticket) => {
                const ticketNum = Number.parseInt(ticket)
                return ticketNum >= startNum && ticketNum <= endNum
              }).length > 0 && (
                <Button
                  onClick={() => handlePurchaseFromTable(ticketNumbers.map((t) => t.number))}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Comprar Seleccionados
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
