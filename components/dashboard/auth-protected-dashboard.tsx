"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Ticket, ShoppingCart, Clock, CheckCircle, Calendar } from "lucide-react"
import { getUserPurchases } from "@/lib/database"
import { createClient } from "@/lib/supabase/client"

interface Purchase {
  id: string
  ticket_numbers: string[]
  total_amount: number
  status: "pending" | "bought"
  created_at: string
  updated_at: string
}

interface DashboardStats {
  totalTickets: number
  totalSpent: number
  activePurchases: number
  boughtTickets: number
}

export function AuthProtectedDashboard() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    totalSpent: 0,
    activePurchases: 0,
    boughtTickets: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log("[v0] Checking user authentication:", user)

      if (!user) {
        console.log("[v0] No user found, redirecting to login")
        router.push("/login")
        return
      }

      setUser(user)
      await fetchUserPurchases()
      setLoading(false)
    }

    checkUser()
  }, [router])

  const fetchUserPurchases = async () => {
    try {
      console.log("[v0] Fetching user purchases...")
      const purchasesData = await getUserPurchases()
      console.log("[v0] User purchases data:", purchasesData)

      setPurchases(purchasesData || [])

      const totalTickets = purchasesData?.reduce((sum, purchase) => sum + purchase.ticket_numbers.length, 0) || 0
      const totalSpent = purchasesData?.reduce((sum, purchase) => sum + purchase.total_amount, 0) || 0
      const activePurchases = purchasesData?.filter((p) => p.status === "pending").length || 0
      const boughtTickets =
        purchasesData
          ?.filter((p) => p.status === "bought")
          .reduce((sum, purchase) => sum + purchase.ticket_numbers.length, 0) || 0

      setStats({
        totalTickets,
        totalSpent,
        activePurchases,
        boughtTickets,
      })
    } catch (error) {
      console.error("[v0] Error fetching user purchases:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "bought":
        return (
          <Badge variant="secondary" className="bg-black text-white border-black">
            <CheckCircle className="h-3 w-3 mr-1" />
            Comprado
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
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pendientes</h3>
            </div>
            <p className="text-3xl font-bold text-gray-600 mb-2">{stats.activePurchases}</p>
            <p className="text-sm text-gray-600">Compras pendientes</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-black rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Comprados</h3>
            </div>
            <p className="text-3xl font-bold text-black mb-2">{stats.boughtTickets}</p>
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
                  <Card
                    key={purchase.id}
                    className={`border ${purchase.status === "pending" ? "border-gray-200 bg-gray-50" : "border-slate-200 bg-white"}`}
                  >
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
                          {purchase.ticket_numbers.slice(0, 20).map((ticketNum, index) => (
                            <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
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
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Estado:</strong> Tu compra está pendiente de aprobación por el administrador.
                          </p>
                        </div>
                      )}

                      {purchase.status === "bought" && (
                        <div className="mt-4 p-3 bg-black text-white rounded-lg">
                          <p className="text-sm">
                            <strong>¡Felicidades!</strong> Tu compra ha sido aprobada. Tus boletos están activos para el
                            sorteo.
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
