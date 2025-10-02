"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Search, Ticket, AlertCircle, Clock } from "lucide-react"
import { getPurchaseByReservationIdAction } from "@/app/actions/purchase-actions"

export function ValidateTickets() {
  const [ticketId, setTicketId] = useState("")
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)

  const handleValidation = async () => {
    if (!ticketId.trim()) return

    setIsValidating(true)

    try {
      const result = await getPurchaseByReservationIdAction(ticketId.trim())

      if (result.success && result.purchase) {
        const purchase = result.purchase

        const mappedResult = {
          id: purchase.reservation_id || ticketId,
          status: purchase.status === "approved" ? "valid" : purchase.status === "pending" ? "pending" : "invalid",
          purchaseDate: new Date(purchase.created_at).toLocaleDateString("es-MX"),
          drawDate: "2024-12-31",
          prize: "Gran Sorteo 2024",
          value: `$${purchase.total_amount.toLocaleString("es-MX")} MXN`,
          buyerName: purchase.buyer_name,
          buyerPhone: purchase.buyer_phone,
          ticketCount: purchase.ticket_numbers?.length || 0,
          ticketNumbers: purchase.ticket_numbers || [],
        }

        setValidationResult(mappedResult)
      } else {
        setValidationResult({ status: "invalid" })
      }
    } catch (error) {
      console.error("[v0] Error validating ticket:", error)
      setValidationResult({ status: "invalid" })
    } finally {
      setIsValidating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "invalid":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "owned":
        return <Ticket className="w-5 h-5 text-blue-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "invalid":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "owned":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "Válido y Aprobado"
      case "pending":
        return "Pendiente de Verificación"
      case "invalid":
        return "Boleto Inválido"
      case "owned":
        return "Comprado y Tuyo"
      default:
        return "Desconocido"
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-amber-50/30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Search className="w-4 h-4" />
            Validación de Boletos
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
              Verificar Tus Boletos
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ingresa el ID de tu boleto para verificar su estado y validez
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <CardTitle className="text-lg text-green-700">Boleto Válido</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-mono text-sm text-green-800">TKT-XXXXXX-XXX</div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 mt-1">Válido y Aprobado</Badge>
                </div>
                <p className="text-sm text-slate-600">
                  El boleto está verificado, aprobado y es elegible para el sorteo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-yellow-200 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <CardTitle className="text-lg text-yellow-700">Boleto Pendiente</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="font-mono text-sm text-yellow-800">TKT-XXXXXX-XXX</div>
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 mt-1">
                    Pendiente de Verificación
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">El boleto está en proceso de verificación de pago.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <CardTitle className="text-lg text-red-700">Boleto Inválido</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-mono text-sm text-red-800">TKT-XXXXXX-XXX</div>
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 mt-1">Boleto Inválido</Badge>
                </div>
                <p className="text-sm text-slate-600">El boleto no existe o no es válido en nuestro sistema.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Ticket className="w-5 h-5 text-amber-600" />
                Validador de Boletos
              </CardTitle>
              <CardDescription className="text-slate-600">
                Ingresa el ID de tu boleto para verificar su autenticidad y estado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ticketId" className="text-slate-700">
                  ID del Boleto
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="ticketId"
                    placeholder="ej., TKT-054308-XFB"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleValidation()
                      }
                    }}
                    className="flex-1 border-slate-300 focus:border-amber-500"
                  />
                  <Button
                    onClick={handleValidation}
                    disabled={!ticketId.trim() || isValidating}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isValidating ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isValidating ? "Validando..." : "Validar"}
                  </Button>
                </div>
              </div>

              {validationResult && (
                <div className="space-y-4">
                  <Separator />

                  <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      {getStatusIcon(validationResult.status)}
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">Resultado de Validación</h3>
                        <Badge className={getStatusColor(validationResult.status)}>
                          {getStatusText(validationResult.status)}
                        </Badge>
                      </div>
                    </div>

                    {validationResult.status !== "invalid" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm bg-white p-4 rounded-lg border border-slate-200">
                          <div className="space-y-1">
                            <span className="text-slate-500 text-xs uppercase tracking-wide">ID del Boleto</span>
                            <div className="font-mono font-semibold text-slate-800 text-base">
                              {validationResult.id}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 text-xs uppercase tracking-wide">Fecha de Compra</span>
                            <div className="font-medium text-slate-800">{validationResult.purchaseDate}</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 text-xs uppercase tracking-wide">Cantidad de Boletos</span>
                            <div className="font-medium text-slate-800">{validationResult.ticketCount} boletos</div>
                          </div>
                        </div>

                        {validationResult.ticketNumbers && validationResult.ticketNumbers.length > 0 && (
                          <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Números de Boletos</h4>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                              {validationResult.ticketNumbers.map((ticketNum: number, index: number) => (
                                <div
                                  key={index}
                                  className="bg-amber-50 border border-amber-200 rounded px-2 py-1.5 text-center"
                                >
                                  <span className="font-mono text-sm font-semibold text-amber-700">{ticketNum}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div className="flex items-center justify-between bg-amber-50 p-4 rounded-lg border border-amber-200">
                          <span className="text-slate-700 font-medium">Valor Total</span>
                          <span className="text-2xl font-bold text-amber-600">{validationResult.value}</span>
                        </div>

                        {validationResult.status === "valid" && (
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 text-green-700">
                              <CheckCircle className="w-6 h-6 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-base">¡Boleto Válido y Aprobado!</p>
                                <p className="text-sm text-green-600">
                                  Este boleto ha sido aprobado y es elegible para el próximo sorteo
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {validationResult.status === "pending" && (
                          <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 text-yellow-700">
                              <Clock className="w-6 h-6 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-base">Verificación Pendiente</p>
                                <p className="text-sm text-yellow-600">
                                  Este boleto está en proceso de verificación de pago. Una vez aprobado, será elegible
                                  para el sorteo.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 text-red-700">
                          <XCircle className="w-6 h-6 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-base">Boleto Inválido</p>
                            <p className="text-sm text-red-600">
                              ID de boleto inválido o no encontrado. Por favor verifica tu boleto e intenta de nuevo.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Cómo Validar Tu Boleto</CardTitle>
              <CardDescription className="text-slate-600">
                Ingresa el ID de reservación que recibiste al comprar tus boletos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p>Busca el ID de reservación en el mensaje de WhatsApp que recibiste al comprar</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    El ID tiene el formato: <code className="font-mono bg-slate-100 px-1 rounded">TKT-XXXXXX-XXX</code>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p>Ingresa el ID completo en el campo de arriba y presiona "Validar"</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p>
                    Verás el estado de tu compra:{" "}
                    <Badge className="bg-yellow-500/10 text-yellow-600 text-xs">Pendiente</Badge> o{" "}
                    <Badge className="bg-green-500/10 text-green-600 text-xs">Aprobado</Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
