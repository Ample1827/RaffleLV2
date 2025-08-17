"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { CheckCircle, Clock, ExternalLink } from "lucide-react"
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button"
import { generatePurchaseWhatsAppMessage, SUPPORT_PHONE_CLEAN } from "@/lib/whatsapp"

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
  const [whatsappMessage, setWhatsappMessage] = useState("")
  const [saved, setSaved] = useState(false) // ✅ prevents duplicates
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)

      // Get purchase data from sessionStorage
      const storedData = sessionStorage.getItem("purchaseData")
      if (storedData) {
        const data = JSON.parse(storedData)
        setPurchaseData(data)

        const message = generatePurchaseWhatsAppMessage({
          userName: `${data.userInfo.firstName} ${data.userInfo.lastName}`,
          ticketCount: data.tickets.length,
          totalAmount: data.totalAmount,
          supportPhone: SUPPORT_PHONE_CLEAN,
          paymentInfoUrl: `${window.location.origin}/pagos`,
        })
        setWhatsappMessage(message)
      }

      setIsLoading(false)
    }

    checkUser()
  }, [router])

  const savePurchaseToDatabase = async () => {
    if (!user || !purchaseData || saved) return

    const supabase = createClient()

    try {
      // ✅ Save/Update user profile
      const { error: userError } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        name: `${purchaseData.userInfo.firstName} ${purchaseData.userInfo.lastName}`,
        phone: purchaseData.userInfo.phoneNumber,
        state: purchaseData.userInfo.state,
      })

      if (userError) throw userError

      // ✅ Save purchase
      const { error: purchaseError } = await supabase.from("purchases").insert({
        user_id: user.id,
        ticket_numbers: purchaseData.tickets.map((t) => Number.parseInt(t)),
        total_amount: purchaseData.totalAmount,
        status: "pending",
      })

      if (purchaseError) throw purchaseError

      // ✅ Update tickets availability
      const { error: ticketError } = await supabase
        .from("tickets")
        .update({ is_available: false })
        .in(
          "ticket_number",
          purchaseData.tickets.map((t) => Number.parseInt(t)),
        )

      if (ticketError) throw ticketError

      setSaved(true) // ✅ prevent re-inserts
      sessionStorage.removeItem("purchaseData") // optional: clear after saving
    } catch (err) {
      console.error("Error saving purchase:", err)
    }
  }

  // ✅ Save to DB only once
  useEffect(() => {
    if (user && purchaseData && !saved) {
      savePurchaseToDatabase()
    }
  }, [user, purchaseData, saved])

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
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    Pendiente
                  </Badge>
                  <span className="text-sm text-slate-600">Esperando confirmación de pago</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 font-medium mb-2">Próximos pasos:</p>
                  <ol className="text-sm text-amber-600 space-y-1 list-decimal list-inside">
                    <li>Realiza la transferencia bancaria</li>
                    <li>Envía el comprobante por WhatsApp</li>
                    <li>Espera la confirmación (24 horas)</li>
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
            <WhatsAppButton
              phoneNumber={SUPPORT_PHONE_CLEAN}
              message={whatsappMessage}
              variant="outline"
              className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              Enviar por WhatsApp
            </WhatsAppButton>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Ver Mis Compras
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
