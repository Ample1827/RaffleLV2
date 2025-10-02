"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Ticket, Calendar, DollarSign, AlertCircle } from "lucide-react"
import { getPurchaseByIdAction } from "@/app/actions/purchase-actions"

interface Purchase {
  id: string
  user_id: string | null
  ticket_numbers: number[]
  total_amount: number
  status: "pending" | "approved"
  created_at: string
  updated_at: string
}

export function VerifyTickets() {
  const [ticketId, setTicketId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!ticketId.trim()) {
      setError("Por favor ingresa un ID de reserva")
      return
    }

    setIsSearching(true)
    setError(null)
    setPurchase(null)

    try {
      // Extract the purchase ID from the ticket ID format (TKT-timestamp-random)
      // For now, we'll search by the full ticket ID
      // In production, you'd want to store the ticket ID in the database

      // Since we don't have a direct mapping, we'll need to search differently
      // For this demo, let's assume the user enters the purchase UUID directly
      // or we implement a ticket_id column in the database

      const result = await getPurchaseByIdAction(ticketId)

      if (!result.success) {
        setError(result.error || "No se encontró ninguna reserva con ese ID")
        return
      }

      setPurchase(result.purchase)
    } catch (err) {
      console.error("[v0] Error searching for purchase:", err)
      setError("Error al buscar la reserva. Por favor intenta de nuevo.")
    } finally {
      setIsSearching(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return <Badge className="bg-emerald-500 text-white">✓ Aprobado</Badge>
    }
    return <Badge className="bg-amber-500 text-white">⏳ Pendiente</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Verificar <span className="text-amber-600">Mis Boletos</span>
          </h2>
          <p className="text-lg text-slate-600">Ingresa tu ID de Reserva para ver todos tus boletos reservados</p>
        </div>

        <Card className="bg-white border-slate-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800">Buscar Reserva</CardTitle>
            <CardDescription className="text-slate-600">
              Ingresa el ID de Reserva que recibiste al hacer tu compra (ejemplo: TKT-175343-PP8)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ticket-id" className="text-slate-700 text-lg">
                  ID de Reserva
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="ticket-id"
                    type="text"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    placeholder="TKT-175343-PP8 o UUID de compra"
                    className="flex-1 bg-slate-50 border-slate-200 text-slate-700 text-lg p-4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-8"
                    size="lg"
                  >
                    {isSearching ? (
                      <>Buscando...</>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-semibold">Error</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {purchase && (
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-xl">
            <CardHeader className="border-b border-amber-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-slate-800">Detalles de tu Reserva</CardTitle>
                {getStatusBadge(purchase.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Ticket className="h-5 w-5" />
                    <span className="font-semibold">Boletos</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">{purchase.ticket_numbers.length}</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-semibold">Total</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">${purchase.total_amount}</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-semibold">Fecha</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{formatDate(purchase.created_at)}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-amber-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Tus Números de Boletos</h3>
                <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto">
                  {purchase.ticket_numbers.map((ticketNum) => (
                    <Badge key={ticketNum} className="bg-amber-500 text-white text-base px-3 py-1.5 font-mono">
                      {ticketNum.toString().padStart(4, "0")}
                    </Badge>
                  ))}
                </div>
              </div>

              {purchase.status === "pending" && (
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
                  <p className="text-amber-800 font-semibold mb-2">⏳ Reserva Pendiente</p>
                  <p className="text-amber-700 text-sm">
                    Tu reserva está pendiente de pago. Por favor completa tu pago enviando el comprobante por WhatsApp
                    para confirmar tu compra. Tus boletos están reservados por 24 horas.
                  </p>
                </div>
              )}

              {purchase.status === "approved" && (
                <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4">
                  <p className="text-emerald-800 font-semibold mb-2">✓ Compra Confirmada</p>
                  <p className="text-emerald-700 text-sm">
                    ¡Felicidades! Tu compra ha sido confirmada. Estos boletos ya son tuyos y participan en el sorteo.
                    ¡Mucha suerte! 🍀
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
