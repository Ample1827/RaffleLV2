"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllPurchases, updatePurchaseStatus } from "@/lib/database"
import { ShoppingCart, Clock, CheckCircle, Calendar, Ticket, DollarSign, User, Phone, MapPin } from "lucide-react"

interface AdminStats {
  totalPurchases: number
  pendingPurchases: number
  approvedPurchases: number
  totalRevenue: number
}

export function AdminDashboard() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalPurchases: 0,
    pendingPurchases: 0,
    approvedPurchases: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAccess = () => {
      const isAdmin = localStorage.getItem("isAdmin")
      const adminEmail = localStorage.getItem("adminEmail")

      if (!isAdmin || adminEmail !== "Adalromero99@gmail.com") {
        router.push("/login")
        return false
      }
      return true
    }

    if (checkAdminAccess()) {
      fetchAdminData()
    }
  }, [router])

  const fetchAdminData = async () => {
    try {
      console.log("[v0] Fetching admin data...")
      const purchasesData = await getAllPurchases()
      console.log("[v0] Purchases data:", purchasesData)

      setPurchases(purchasesData || [])

      const totalPurchases = purchasesData?.length || 0
      const pendingPurchases = purchasesData?.filter((p) => p.status === "pending").length || 0
      const approvedPurchases = purchasesData?.filter((p) => p.status === "approved").length || 0
      const totalRevenue =
        purchasesData?.filter((p) => p.status === "approved").reduce((sum, p) => sum + p.total_amount, 0) || 0

      setStats({
        totalPurchases,
        pendingPurchases,
        approvedPurchases,
        totalRevenue,
      })
    } catch (error) {
      console.error("[v0] Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePurchaseStatus = async (purchaseId: string, newStatus: "pending" | "approved") => {
    setUpdating(true)
    try {
      console.log("[v0] Updating purchase status:", { purchaseId, newStatus })
      await updatePurchaseStatus(purchaseId, newStatus)
      await fetchAdminData() // Refresh data
      setSelectedPurchase(null)
      alert(`Compra ${newStatus === "approved" ? "aprobada" : "marcada como pendiente"} exitosamente`)
    } catch (error) {
      console.error("[v0] Error updating purchase status:", error)
      alert("Error al actualizar el estado de la compra")
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5 text-sm font-medium"
          >
            <Clock className="h-4 w-4 mr-1.5" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1.5 text-sm font-medium"
          >
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Aprobado
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
          <p className="text-gray-600">Gestiona compras y aprueba pagos del sorteo</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Compras</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPurchases}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Pendientes</h3>
            </div>
            <p className="text-3xl font-bold text-amber-600">{stats.pendingPurchases}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Aprobadas</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{stats.approvedPurchases}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Ingresos</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">${stats.totalRevenue}</p>
          </div>
        </div>

        {/* Purchases Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Compras</h2>
            <p className="text-gray-600 mt-1">Revisa y aprueba las compras de boletos</p>
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
                  <Card
                    key={purchase.id}
                    className={`border-2 transition-all hover:shadow-md ${
                      purchase.status === "pending"
                        ? "border-amber-200 bg-amber-50/30"
                        : "border-emerald-200 bg-emerald-50/30"
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold">
                            Compra #{purchase.id.slice(-8).toUpperCase()}
                          </CardTitle>
                          {purchase.buyer_name && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{purchase.buyer_name}</span>
                            </div>
                          )}
                          {purchase.buyer_phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-4 w-4" />
                              <span className="font-medium">{purchase.buyer_phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(purchase.status)}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPurchase(purchase)}
                                className="border-slate-300 hover:bg-slate-50 font-medium"
                              >
                                Ver Detalles
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                              <DialogHeader className="pb-6 border-b border-slate-200">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-slate-600 font-medium mb-1">Detalles de Compra</p>
                                      <DialogTitle className="text-2xl font-bold text-slate-900">
                                        #{purchase.id.slice(-12).toUpperCase()}
                                      </DialogTitle>
                                    </div>
                                    {selectedPurchase && (
                                      <div className="flex-shrink-0">{getStatusBadge(selectedPurchase.status)}</div>
                                    )}
                                  </div>
                                </div>
                              </DialogHeader>

                              {selectedPurchase && (
                                <div className="space-y-6 pt-4">
                                  {/* Summary Cards */}
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Ticket className="h-5 w-5 text-slate-600" />
                                        <p className="text-sm text-slate-600 font-medium">Boletos</p>
                                      </div>
                                      <p className="text-3xl font-bold text-slate-900">
                                        {selectedPurchase.ticket_numbers.length}
                                      </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="h-5 w-5 text-slate-600" />
                                        <p className="text-sm text-slate-600 font-medium">Total</p>
                                      </div>
                                      <p className="text-3xl font-bold text-slate-900">
                                        ${selectedPurchase.total_amount}
                                      </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-5 w-5 text-slate-600" />
                                        <p className="text-sm text-slate-600 font-medium">Fecha</p>
                                      </div>
                                      <p className="text-lg font-bold text-slate-900 leading-tight">
                                        {new Date(selectedPurchase.created_at).toLocaleDateString("es-MX", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </p>
                                      <p className="text-sm text-slate-600 mt-1">
                                        {new Date(selectedPurchase.created_at).toLocaleTimeString("es-MX", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                                    <div className="flex items-center gap-2 mb-4">
                                      <User className="h-6 w-6 text-blue-600" />
                                      <h3 className="text-xl font-bold text-slate-900">Información del Comprador</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                          <User className="h-5 w-5 text-blue-600" />
                                          <p className="text-sm text-slate-600 font-medium">Nombre Completo</p>
                                        </div>
                                        <p className="text-xl font-bold text-slate-900">
                                          {selectedPurchase.buyer_name || "No proporcionado"}
                                        </p>
                                      </div>

                                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Phone className="h-5 w-5 text-blue-600" />
                                          <p className="text-sm text-slate-600 font-medium">Teléfono</p>
                                        </div>
                                        <p className="text-xl font-bold text-slate-900">
                                          {selectedPurchase.buyer_phone || "No proporcionado"}
                                        </p>
                                      </div>

                                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                          <MapPin className="h-5 w-5 text-blue-600" />
                                          <p className="text-sm text-slate-600 font-medium">Estado</p>
                                        </div>
                                        <p className="text-xl font-bold text-slate-900">
                                          {selectedPurchase.buyer_state || "No proporcionado"}
                                        </p>
                                      </div>

                                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                          <ShoppingCart className="h-5 w-5 text-blue-600" />
                                          <p className="text-sm text-slate-600 font-medium">ID de Compra</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 font-mono break-all">
                                          {selectedPurchase.id}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Ticket Numbers */}
                                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                    <div className="flex items-center justify-between mb-4">
                                      <h3 className="text-lg font-semibold text-slate-900">Números de Boletos</h3>
                                      <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                                        {selectedPurchase.ticket_numbers.length} boletos
                                      </Badge>
                                    </div>
                                    <div className="bg-white rounded-lg border border-slate-200 p-4 max-h-64 overflow-y-auto">
                                      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                        {selectedPurchase.ticket_numbers.map((ticketNum: string, index: number) => (
                                          <div
                                            key={index}
                                            className="bg-slate-100 border border-slate-200 rounded px-2 py-2 text-center"
                                          >
                                            <p className="text-sm font-semibold text-slate-900 font-mono">
                                              {ticketNum.toString().padStart(4, "0")}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Transaction Details */}
                                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                      Detalles de Transacción
                                    </h3>
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-sm text-slate-600">ID de Compra</span>
                                        <span className="text-sm font-semibold text-slate-900 font-mono">
                                          {selectedPurchase.id}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-sm text-slate-600">Fecha y Hora</span>
                                        <span className="text-sm font-semibold text-slate-900">
                                          {formatDate(selectedPurchase.created_at)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-sm text-slate-600">Estado</span>
                                        <span>{getStatusBadge(selectedPurchase.status)}</span>
                                      </div>
                                      <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-slate-600">Monto Total</span>
                                        <span className="text-lg font-bold text-slate-900">
                                          ${selectedPurchase.total_amount}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Admin Actions */}
                                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Acciones</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <Button
                                        onClick={() => handleUpdatePurchaseStatus(selectedPurchase.id, "approved")}
                                        disabled={updating || selectedPurchase.status === "approved"}
                                        className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
                                      >
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        {selectedPurchase.status === "approved" ? "Aprobada" : "Aprobar"}
                                      </Button>
                                      <Button
                                        onClick={() => handleUpdatePurchaseStatus(selectedPurchase.id, "pending")}
                                        disabled={updating || selectedPurchase.status === "pending"}
                                        variant="outline"
                                        className="h-12 border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold disabled:opacity-50"
                                      >
                                        <Clock className="h-5 w-5 mr-2" />
                                        {selectedPurchase.status === "pending" ? "Pendiente" : "Marcar Pendiente"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(purchase.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Boletos</p>
                          <p className="font-bold text-lg text-blue-600">{purchase.ticket_numbers.length}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Total</p>
                          <p className="font-bold text-lg text-green-600">${purchase.total_amount}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Estado</p>
                          <div className="mt-1">{getStatusBadge(purchase.status)}</div>
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
