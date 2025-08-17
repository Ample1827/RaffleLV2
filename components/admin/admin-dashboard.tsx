"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { StatusUpdateWhatsApp } from "@/components/admin/status-update-whatsapp"
import {
  Users,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  Ticket,
  DollarSign,
} from "lucide-react"

interface Purchase {
  id: string
  user_id: string
  ticket_numbers: number[]
  total_amount: number
  status: "pending" | "approved" | "denied"
  created_at: string
  updated_at: string
  users: {
    name: string
    email: string
    phone: string
  }
}

interface AdminStats {
  totalUsers: number
  totalPurchases: number
  pendingPurchases: number
  totalRevenue: number
  approvedPurchases: number
  deniedPurchases: number
}

export function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPurchases: 0,
    pendingPurchases: 0,
    totalRevenue: 0,
    approvedPurchases: 0,
    deniedPurchases: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkAdminUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Check if user is admin
      const { data: userData, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

      if (error || !userData?.is_admin) {
        router.push("/dashboard")
        return
      }

      setUser(user)
      await fetchAdminData()
      setLoading(false)
    }

    checkAdminUser()
  }, [router])

  const fetchAdminData = async () => {
    const supabase = createClient()

    // Fetch all purchases with user data
    const { data: purchasesData, error: purchasesError } = await supabase
      .from("purchases")
      .select(
        `
        *,
        users (
          name,
          email,
          phone
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (purchasesError) {
      console.error("Error fetching purchases:", purchasesError)
      return
    }

    setPurchases(purchasesData || [])

    // Calculate stats
    const totalPurchases = purchasesData?.length || 0
    const pendingPurchases = purchasesData?.filter((p) => p.status === "pending").length || 0
    const approvedPurchases = purchasesData?.filter((p) => p.status === "approved").length || 0
    const deniedPurchases = purchasesData?.filter((p) => p.status === "denied").length || 0
    const totalRevenue =
      purchasesData?.filter((p) => p.status === "approved").reduce((sum, p) => sum + p.total_amount, 0) || 0

    // Get unique users count
    const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

    setStats({
      totalUsers: usersCount || 0,
      totalPurchases,
      pendingPurchases,
      totalRevenue,
      approvedPurchases,
      deniedPurchases,
    })
  }

  const updatePurchaseStatus = async (purchaseId: string, newStatus: "approved" | "denied") => {
    const supabase = createClient()

    const { error } = await supabase
      .from("purchases")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchaseId)

    if (error) {
      console.error("Error updating purchase status:", error)
      alert("Error al actualizar el estado de la compra")
      return
    }

    // Refresh data
    await fetchAdminData()
    setSelectedPurchase(null)
    alert(`Compra ${newStatus === "approved" ? "aprobada" : "rechazada"} exitosamente`)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona compras, aprueba pagos y supervisa las operaciones del sorteo</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Usuarios</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Compras</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.totalPurchases}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Pendientes</h3>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingPurchases}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Aprobadas</h3>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{stats.approvedPurchases}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Rechazadas</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.deniedPurchases}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Ingresos</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">${stats.totalRevenue}</p>
          </div>
        </div>

        {/* Purchases Management */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Compras</h2>
            <p className="text-gray-600">Revisa y aprueba las compras de boletos</p>
          </div>

          <div className="p-6">
            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay compras registradas</h3>
                <p className="text-gray-600">Las compras aparecerán aquí cuando los usuarios compren boletos.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <Card key={purchase.id} className="border border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Compra #{purchase.id.slice(-8).toUpperCase()}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(purchase.status)}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPurchase(purchase)}
                                className="border-slate-300"
                              >
                                Ver Detalles
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalles de Compra #{purchase.id.slice(-8).toUpperCase()}</DialogTitle>
                              </DialogHeader>

                              {selectedPurchase && (
                                <div className="space-y-6">
                                  {/* Customer Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900">Información del Cliente</h4>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Users className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm">{selectedPurchase.users.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Mail className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm">{selectedPurchase.users.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm">{selectedPurchase.users.phone}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900">Información de Compra</h4>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Ticket className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm">
                                            {selectedPurchase.ticket_numbers.length} boletos
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm">${selectedPurchase.total_amount}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm">{formatDate(selectedPurchase.created_at)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Ticket Numbers */}
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Números de Boletos</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {selectedPurchase.ticket_numbers.map((ticketNum) => (
                                        <Badge
                                          key={ticketNum}
                                          variant="secondary"
                                          className="bg-slate-100 text-slate-700 text-xs"
                                        >
                                          {ticketNum.toString().padStart(4, "0")}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Admin Actions */}
                                  {selectedPurchase.status === "pending" && (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Notas del Administrador (Opcional)
                                        </label>
                                        <Textarea
                                          value={adminNotes}
                                          onChange={(e) => setAdminNotes(e.target.value)}
                                          placeholder="Agregar notas sobre esta compra..."
                                          className="bg-slate-50 border-slate-200"
                                        />
                                      </div>

                                      <div className="flex gap-3">
                                        <Button
                                          onClick={() => updatePurchaseStatus(selectedPurchase.id, "approved")}
                                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Aprobar Compra
                                        </Button>
                                        <Button
                                          onClick={() => updatePurchaseStatus(selectedPurchase.id, "denied")}
                                          variant="outline"
                                          className="flex-1 border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Rechazar Compra
                                        </Button>
                                      </div>

                                      <StatusUpdateWhatsApp
                                        userName={selectedPurchase.users.name}
                                        userPhone={selectedPurchase.users.phone}
                                        ticketCount={selectedPurchase.ticket_numbers.length}
                                        ticketNumbers={selectedPurchase.ticket_numbers.map((n) =>
                                          n.toString().padStart(4, "0"),
                                        )}
                                        status="approved"
                                      />
                                    </div>
                                  )}

                                  {selectedPurchase.status !== "pending" && (
                                    <div className="flex justify-center">
                                      <StatusUpdateWhatsApp
                                        userName={selectedPurchase.users.name}
                                        userPhone={selectedPurchase.users.phone}
                                        ticketCount={selectedPurchase.ticket_numbers.length}
                                        ticketNumbers={selectedPurchase.ticket_numbers.map((n) =>
                                          n.toString().padStart(4, "0"),
                                        )}
                                        status={selectedPurchase.status as "approved" | "denied"}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(purchase.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Cliente</p>
                          <p className="font-semibold">{purchase.users.name}</p>
                          <p className="text-xs text-gray-500">{purchase.users.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Boletos</p>
                          <p className="font-semibold text-amber-600">{purchase.ticket_numbers.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total</p>
                          <p className="font-semibold text-green-600">${purchase.total_amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Estado</p>
                          {getStatusBadge(purchase.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
