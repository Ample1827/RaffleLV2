"use client"

import { useState } from "react"
import { createPurchaseWithoutAuth } from "@/lib/database"
import { openWhatsApp } from "@/lib/whatsapp"
import { Button } from "@/components/ui/button"
import { useAllTickets, useTicketsByRange } from "@/lib/hooks/use-tickets"

const TICKET_RANGES = [
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
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [purchaseForm, setPurchaseForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    state: "",
    promoCode: "",
  })

  const { sectionCounts, isLoading, mutate: refreshAllTickets } = useAllTickets()

  const toggleRange = (index: number) => {
    if (expandedRange === index) {
      setExpandedRange(null)
    } else {
      setExpandedRange(index)
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

      const purchase = await createPurchaseWithoutAuth({
        ticket_numbers: ticketNumbers,
        total_amount: totalAmount,
        buyer_name: `${purchaseForm.firstName} ${purchaseForm.lastName}`,
        buyer_phone: purchaseForm.phoneNumber,
        buyer_state: purchaseForm.state,
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

      refreshAllTickets()
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

  return null
}

function ExpandedTicketRange({
  startNumber,
  endNumber,
  selectedTickets,
  toggleTicketSelection,
}: {
  startNumber: number
  endNumber: number
  selectedTickets: string[]
  toggleTicketSelection: (ticketNumber: string, isAvailable: boolean) => void
}) {
  const { tickets, isLoading } = useTicketsByRange(startNumber, endNumber, true)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const ticketNumbers = tickets.map((ticket) => ({
    number: ticket.ticket_number.toString().padStart(4, "0"),
    available: ticket.is_available,
  }))

  return (
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
  )
}
