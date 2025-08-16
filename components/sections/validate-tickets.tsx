"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Search, Ticket, AlertCircle, Clock } from "lucide-react"

const mockTickets = [
  {
    id: "TKT-2024-001234",
    status: "valid",
    purchaseDate: "2024-01-15",
    drawDate: "2024-01-20",
    prize: "Sorteo Gran Premio",
    value: "$80,000 MXN",
  },
  {
    id: "TKT-2024-001235",
    status: "pending",
    purchaseDate: "2024-01-10",
    drawDate: "2024-01-15",
    prize: "Motocicleta Deportiva",
    value: "$45,000 MXN",
  },
  {
    id: "TKT-2024-001236",
    status: "invalid",
    purchaseDate: "2023-12-20",
    drawDate: "2024-01-01",
    prize: "Especial de Temporada",
    value: "$25,000 MXN",
  },
  {
    id: "TKT-2024-001237",
    status: "owned",
    purchaseDate: "2024-01-05",
    drawDate: "2024-01-10",
    prize: "Premio Especial",
    value: "$50,000 MXN",
  },
]

export function ValidateTickets() {
  const [ticketId, setTicketId] = useState("")
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)

  const handleValidation = async () => {
    if (!ticketId.trim()) return

    setIsValidating(true)

    // Simulate API call
    setTimeout(() => {
      const ticket = mockTickets.find((t) => t.id.toLowerCase() === ticketId.toLowerCase())
      setValidationResult(ticket || { status: "invalid" })
      setIsValidating(false)
    }, 1500)
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
        return "Válido y Activo"
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

        <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
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
                  <div className="font-mono text-sm text-green-800">TKT-2024-001234</div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 mt-1">Válido y Activo</Badge>
                </div>
                <p className="text-sm text-slate-600">El boleto está verificado y es elegible para el sorteo.</p>
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
                  <div className="font-mono text-sm text-yellow-800">TKT-2024-001235</div>
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
                  <div className="font-mono text-sm text-red-800">TKT-2024-001236</div>
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 mt-1">Boleto Inválido</Badge>
                </div>
                <p className="text-sm text-slate-600">El boleto no existe o no es válido en nuestro sistema.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-lg text-blue-700">Boleto Comprado</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-mono text-sm text-blue-800">TKT-2024-001237</div>
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 mt-1">Comprado y Tuyo</Badge>
                </div>
                <p className="text-sm text-slate-600">Este boleto ha sido comprado y te pertenece.</p>
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
                    placeholder="ej., TKT-2024-001234"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
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

                  <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      {getStatusIcon(validationResult.status)}
                      <div>
                        <h3 className="font-semibold text-slate-800">Resultado de Validación</h3>
                        <Badge className={getStatusColor(validationResult.status)}>
                          {getStatusText(validationResult.status)}
                        </Badge>
                      </div>
                    </div>

                    {validationResult.status !== "invalid" ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">ID del Boleto:</span>
                            <div className="font-mono font-medium text-slate-800">{validationResult.id}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Fecha de Compra:</span>
                            <div className="font-medium text-slate-800">{validationResult.purchaseDate}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Fecha del Sorteo:</span>
                            <div className="font-medium text-slate-800">{validationResult.drawDate}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Categoría del Premio:</span>
                            <div className="font-medium text-slate-800">{validationResult.prize}</div>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Valor del Premio:</span>
                          <span className="text-xl font-bold text-amber-600">{validationResult.value}</span>
                        </div>

                        {validationResult.status === "valid" && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              ¡Este boleto es válido y elegible para el próximo sorteo!
                            </div>
                          </div>
                        )}

                        {validationResult.status === "pending" && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-700 text-sm">
                              <Clock className="w-4 h-4" />
                              Este boleto está pendiente de verificación de pago.
                            </div>
                          </div>
                        )}

                        {validationResult.status === "owned" && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-700 text-sm">
                              <Ticket className="w-4 h-4" />
                              Este boleto ha sido comprado y te pertenece.
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 text-sm">
                          <XCircle className="w-4 h-4" />
                          ID de boleto inválido. Por favor verifica tu boleto e intenta de nuevo.
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
              <CardTitle className="text-lg text-slate-800">IDs de Boletos de Ejemplo para Pruebas</CardTitle>
              <CardDescription className="text-slate-600">
                Usa estos IDs de ejemplo para probar el sistema de validación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-slate-50/50 rounded border border-slate-200">
                  <code className="font-mono text-slate-700">TKT-2024-001234</code>
                  <Badge className="bg-green-500/10 text-green-600">Válido</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50/50 rounded border border-slate-200">
                  <code className="font-mono text-slate-700">TKT-2024-001235</code>
                  <Badge className="bg-yellow-500/10 text-yellow-600">Pendiente</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50/50 rounded border border-slate-200">
                  <code className="font-mono text-slate-700">TKT-2024-001236</code>
                  <Badge className="bg-red-500/10 text-red-600">Inválido</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50/50 rounded border border-slate-200">
                  <code className="font-mono text-slate-700">TKT-2024-001237</code>
                  <Badge className="bg-blue-500/10 text-blue-600">Comprado</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
