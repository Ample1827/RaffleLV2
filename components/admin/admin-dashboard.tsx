"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllPurchases, updatePurchaseStatus } from "@/lib/database"
import { ShoppingCart, Clock, CheckCircle, Calendar, Ticket, DollarSign } from "lucide-react"

interface AdminStats {
  totalPurchases: number
  pendingPurchases: number
  boughtPurchases: number
  totalRevenue: number
}

export function AdminDashboard() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalPurchases: 0,
    pendingPurchases: 0,
    boughtPurchases: 0,
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
      const boughtPurchases = purchasesData?.filter((p) => p.status === "bought").length || 0
      const totalRevenue =
        purchasesData?.filter((p) => p.status === "bought").reduce((sum, p) => sum + p.total_amount, 0) || 0

      setStats({
        totalPurchases,
        pendingPurchases,
        boughtPurchases,
        totalRevenue,
      })
    } catch (error) {
      console.error("[v0] Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePurchaseStatus = async (purchaseId: string, newStatus: "pending" | "bought") => {
    setUpdating(true)
    try {
      console.log("[v0] Updating purchase status:", { purchaseId, newStatus })
      await updatePurchaseStatus(purchaseId, newStatus)
      await fetchAdminData() // Refresh data
      setSelectedPurchase(null)
      alert(`Compra ${newStatus === "bought" ? "aprobada" : "marcada como pendiente"} exitosamente`)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona compras y aprueba pagos del sorteo</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Total Compras</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.totalPurchases}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Pendientes</h3>
            </div>
            <p className="text-2xl font-bold text-gray-600">{stats.pendingPurchases}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-black rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Compradas</h3>
            </div>
            <p className="text-2xl font-bold text-black">{stats.boughtPurchases}</p>
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
                  <Card
                    key={purchase.id}
                    className={`border ${purchase.status === "pending" ? "border-gray-200 bg-gray-50" : "border-slate-200 bg-white"}`}
                  >
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
                                  {/* Purchase Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900">Estado Actual</h4>
                                      <div className="space-y-2">{getStatusBadge(selectedPurchase.status)}</div>
                                    </div>
                                  </div>

                                  {/* Ticket Numbers */}
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Números de Boletos</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {selectedPurchase.ticket_numbers.map((ticketNum: string, index: number) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="bg-slate-100 text-slate-700 text-xs"
                                        >
                                          {ticketNum.toString().padStart(4, "0")}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Admin Actions */}
                                  <div className="space-y-4">
                                    <div className="flex gap-3">
                                      <Button
                                        onClick={() => handleUpdatePurchaseStatus(selectedPurchase.id, "bought")}
                                        disabled={updating || selectedPurchase.status === "bought"}
                                        className="flex-1 bg-black hover:bg-gray-800 text-white"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {selectedPurchase.status === "bought" ? "Ya Aprobada" : "Aprobar Compra"}
                                      </Button>
                                      <Button
                                        onClick={() => handleUpdatePurchaseStatus(selectedPurchase.id, "pending")}
                                        disabled={updating || selectedPurchase.status === "pending"}
                                        variant="outline"
                                        className="flex-1 border-gray-500 text-gray-600 hover:bg-gray-50"
                                      >
                                        <Clock className="h-4 w-4 mr-2" />
                                        {selectedPurchase.status === "pending" ? "Ya Pendiente" : "Marcar Pendiente"}
                                      </Button>
                                    </div>
                                  </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
