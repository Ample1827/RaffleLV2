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
    null
  )
}
