"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Ticket, ShoppingCart, Clock, CheckCircle, XCircle, Calendar } from "lucide-react"

interface Purchase {
  id: string
  ticket_numbers: number[]
  total_amount: number
  status: "pending" | "approved" | "denied"
  created_at: string
  updated_at: string
}

interface DashboardStats {
  totalTickets: number
  totalSpent: number
  activePurchases: number
  approvedTickets: number
}

export function AuthProtectedDashboard() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    totalSpent: 0,
    activePurchases: 0,
    approvedTickets: 0,
  })
  const [loading, setLoading] = useState(true)
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
      await fetchUserPurchases(user.id)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const fetchUserPurchases = async (userId: string) => {
    const supabase = createClient()

    const { data: purchasesData, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching purchases:", error)
      return
    }

    setPurchases(purchasesData || [])

    const totalTickets = purchasesData?.reduce((sum, purchase) => sum + purchase.ticket_numbers.length, 0) || 0
    const totalSpent = purchasesData?.reduce((sum, purchase) => sum + purchase.total_amount, 0) || 0
    const activePurchases = purchasesData?.filter((p) => p.status === "pending").length || 0
    const approvedTickets =
      purchasesData
        ?.filter((p) => p.status === "approved")
        .reduce((sum, purchase) => sum + purchase.ticket_numbers.length, 0) || 0

    setStats({
      totalTickets,
      totalSpent,
      activePurchases,
      approvedTickets,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobado
          </Badge>
        )
      case "denied":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600">
              <Ticket className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Acceso Requerido</h1>
            <p className="text-gray-600">Necesitas iniciar sesión para ver tus compras y gestionar tus boletos.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ver Mis Compras</h1>
          <p className="text-gray-600">Gestiona tus boletos y revisa el estado de tus compras</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Ticket className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total Boletos</h3>
            </div>
            <p className="text-3xl font-bold text-amber-600 mb-2">{stats.totalTickets}</p>
            <p className="text-sm text-gray-600">Boletos comprados</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total Gastado</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">${stats.totalSpent}</p>
            <p className="text-sm text-gray-600">En compras</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pendientes</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">{stats.activePurchases}</p>
            <p className="text-sm text-gray-600">Compras pendientes</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Aprobados</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-600 mb-2">{stats.approvedTickets}</p>
            <p className="text-sm text-gray-600">Boletos confirmados</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-gray-900">Historial de Compras</h2>
            <p className="text-gray-600">Revisa el estado de todas tus compras de boletos</p>
          </div>

          <div className="p-6">
            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes compras aún</h3>
                <p className="text-gray-600 mb-6">¡Compra tus primeros boletos y participa en el sorteo!</p>
                <Link href="/buy-tickets">
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white">
                    Comprar Boletos
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <Card key={purchase.id} className="border border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Compra #{purchase.id.slice(-8).toUpperCase()}</CardTitle>
                        {getStatusBadge(purchase.status)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(purchase.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Número de Boletos</p>
                          <p className="font-semibold text-amber-600">{purchase.ticket_numbers.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
                          <p className="font-semibold text-green-600">${purchase.total_amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Precio por Boleto</p>
                          <p className="font-semibold">
                            ${(purchase.total_amount / purchase.ticket_numbers.length).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Números de Boletos:</p>
                        <div className="flex flex-wrap gap-1">
                          {purchase.ticket_numbers.slice(0, 20).map((ticketNum) => (
                            <Badge key={ticketNum} variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                              {ticketNum.toString().padStart(4, "0")}
                            </Badge>
                          ))}
                          {purchase.ticket_numbers.length > 20 && (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                              +{purchase.ticket_numbers.length - 20} más
                            </Badge>
                          )}
                        </div>
                      </div>

                      {purchase.status === "pending" && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-700">
                            <strong>Acción requerida:</strong> Realiza la transferencia bancaria y envía el comprobante
                            por WhatsApp para confirmar tu compra.
                          </p>
                        </div>
                      )}

                      {purchase.status === "denied" && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>Compra rechazada:</strong> Contacta a soporte para más información sobre el rechazo
                            de tu pago.
                          </p>
                        </div>
                      )}

                      {purchase.status === "approved" && (
                        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <p className="text-sm text-emerald-700">
                            <strong>¡Felicidades!</strong> Tu compra ha sido confirmada. Tus boletos están activos para
                            el sorteo.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/buy-tickets">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white">
                Comprar Más Boletos
              </Button>
            </Link>
            <Link href="/verify-tickets">
              <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent">
                Verificar Boletos
              </Button>
            </Link>
            <Link href="/pagos">
              <Button variant="outline" className="border-slate-600 text-slate-600 hover:bg-slate-50 bg-transparent">
                Información de Pago
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
