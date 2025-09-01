"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { CheckCircle, Clock, ExternalLink } from "lucide-react"
import { createPurchase } from "@/lib/database"

interface PurchaseData {
  tickets: string[]
  totalAmount: number
  packageInfo?: {
    tickets: number
    price: number
  }
  userInfo: {
    firstName: string
    lastName: string
    phoneNumber: string
    state: string
  }
}

export default function ResumenBoletosPage() {
  const [user, setUser] = useState<any>(null)
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [purchaseCreated, setPurchaseCreated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log("[v0] Checking user in resumen boletos:", user)

      if (!user) {
        console.log("[v0] No user found, redirecting to login")
        router.push("/login")
        return
      }

      setUser(user)

      const storedData = sessionStorage.getItem("purchaseData")
      if (storedData) {
        const data = JSON.parse(storedData)
        console.log("[v0] Purchase data found:", data)
        setPurchaseData(data)
      } else {
        console.log("[v0] No purchase data found")
      }

      setIsLoading(false)
    }

    checkUser()
  }, [router])

  const savePurchaseToDatabase = async () => {
    if (!user || !purchaseData || purchaseCreated) return

    try {
      console.log("[v0] Creating purchase in database...")

      const purchase = await createPurchase({
        ticket_numbers: purchaseData.tickets,
        quantity: purchaseData.tickets.length,
        total_amount: purchaseData.totalAmount,
      })

      console.log("[v0] Purchase created successfully:", purchase)
      setPurchaseCreated(true)

      // Clear the session storage after successful creation
      sessionStorage.removeItem("purchaseData")
    } catch (error) {
      console.error("[v0] Error creating purchase:", error)
      alert("Error al crear la compra. Por favor, contacta al soporte.")
    }
  }

  useEffect(() => {
    if (user && purchaseData && !purchaseCreated) {
      savePurchaseToDatabase()
    }
  }, [user, purchaseData, purchaseCreated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando resumen...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!purchaseData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-slate-800">No hay boletos seleccionados</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">No se encontraron boletos para procesar.</p>
              <Button onClick={() => router.push("/buy-tickets")} className="bg-amber-500 hover:bg-amber-600">
                Comprar Boletos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Resumen de Boletos</h1>
            <p className="text-slate-600">¡Felicidades! Tus boletos han sido reservados exitosamente.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Información de Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Titular</p>
                  <p className="font-semibold">
                    {purchaseData.userInfo.firstName} {purchaseData.userInfo.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Teléfono</p>
                  <p className="font-semibold">{purchaseData.userInfo.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Estado</p>
                  <p className="font-semibold">{purchaseData.userInfo.state}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Número de boletos</p>
                  <p className="font-semibold text-amber-600">{purchaseData.tickets.length}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total a pagar</p>
                  <p className="font-bold text-2xl text-amber-600">${purchaseData.totalAmount}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Estado del Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Pendiente
                  </Badge>
                  <span className="text-sm text-slate-600">Esperando aprobación del administrador</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 font-medium mb-2">Próximos pasos:</p>
                  <ol className="text-sm text-amber-600 space-y-1 list-decimal list-inside">
                    <li>Realiza la transferencia bancaria</li>
                    <li>Envía el comprobante por WhatsApp</li>
                    <li>Espera la aprobación del administrador</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tus Números de Boletos</CardTitle>
              <CardDescription>Estos son los números que has reservado para el sorteo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {purchaseData.tickets.map((ticket) => (
                  <Badge key={ticket} className="bg-amber-500 text-white text-sm px-3 py-1">
                    {ticket}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/pagos")} className="bg-amber-500 hover:bg-amber-600 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Información de Pago
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Ver Mis Compras
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
