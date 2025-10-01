"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAllPurchasesAdmin, updatePurchaseStatusAdmin, deletePurchaseAdmin } from "@/app/actions/admin-actions"
import { seedTickets } from "@/app/actions/seed-tickets"
import { checkTicketCount } from "@/app/actions/check-tickets"
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Calendar,
  Ticket,
  DollarSign,
  LogOut,
  Trash2,
  Database,
  Shield,
  Lock,
} from "lucide-react"

interface AdminStats {
  totalPurchases: number
  pendingPurchases: number
  approvedPurchases: number
  totalRevenue: number
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [purchases, setPurchases] = useState<any[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalPurchases: 0,
    pendingPurchases: 0,
    approvedPurchases: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null)
  const [updating, setUpdating] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [ticketCount, setTicketCount] = useState<number | null>(null)
  const [checkingTickets, setCheckingTickets] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const isAdmin = localStorage.getItem("isAdmin")
    const adminEmail = localStorage.getItem("adminEmail")

    if (isAdmin && adminEmail === "Adalromero99@gmail.com") {
      setIsAuthenticated(true)
      fetchAdminData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // Simple admin authentication
    if (email === "Adalromero99@gmail.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true")
      localStorage.setItem("adminEmail", email)
      setIsAuthenticated(true)
      fetchAdminData()
    } else {
      setLoginError("Credenciales incorrectas")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("adminEmail")
    setIsAuthenticated(false)
    setEmail("")
    setPassword("")
  }

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      console.log("[v0] Fetching admin data...")
      const purchasesData = await getAllPurchasesAdmin()
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

  const handleMarkAsSold = async (purchaseId: string) => {
    setUpdating(true)
    try {
      console.log("[v0] [Admin Page] Marking purchase as sold:", purchaseId)
      const result = await updatePurchaseStatusAdmin(purchaseId, "approved")
      console.log("[v0] [Admin Page] Update result:", result)
      await fetchAdminData() // Refresh data
      setSelectedPurchase(null)
      alert("Boletos marcados como vendidos y actualizados en todo el sitio")
    } catch (error) {
      console.error("[v0] [Admin Page] Error updating purchase status:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar el estado"
      alert(
        `Error al actualizar el estado de la compra:\n\n${errorMessage}\n\nPor favor, intenta de nuevo o contacta soporte.`,
      )
    } finally {
      setUpdating(false)
    }
  }

  const handleMarkAsPending = async (purchaseId: string) => {
    setUpdating(true)
    try {
      console.log("[v0] [Admin Page] Marking purchase as pending:", purchaseId)
      const result = await updatePurchaseStatusAdmin(purchaseId, "pending")
      console.log("[v0] [Admin Page] Update result:", result)
      await fetchAdminData() // Refresh data
      setSelectedPurchase(null)
      alert("Boletos marcados como pendientes y disponibles nuevamente")
    } catch (error) {
      console.error("[v0] [Admin Page] Error updating purchase status:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar el estado"
      alert(
        `Error al actualizar el estado de la compra:\n\n${errorMessage}\n\nPor favor, intenta de nuevo o contacta soporte.`,
      )
    } finally {
      setUpdating(false)
    }
  }

  const handleDeletePurchase = async (purchaseId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta compra? Los boletos volverán a estar disponibles.")) {
      return
    }

    setUpdating(true)
    try {
      console.log("[v0] Deleting purchase:", purchaseId)
      await deletePurchaseAdmin(purchaseId)
      await fetchAdminData() // Refresh data
      setSelectedPurchase(null)
      alert("Compra eliminada exitosamente. Los boletos están disponibles nuevamente.")
    } catch (error) {
      console.error("[v0] Error deleting purchase:", error)
      alert("Error al eliminar la compra")
    } finally {
      setUpdating(false)
    }
  }

  const handleSeedDatabase = async () => {
    if (!confirm("¿Estás seguro de que quieres inicializar la base de datos con 10,000 boletos?")) {
      return
    }

    setSeeding(true)
    try {
      const result = await seedTickets()
      alert(result.message)
      if (result.success) {
        await fetchAdminData()
        await handleCheckTickets()
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      alert("Error al inicializar la base de datos")
    } finally {
      setSeeding(false)
    }
  }

  const handleCheckTickets = async () => {
    setCheckingTickets(true)
    try {
      const result = await checkTicketCount()
      if (result.success) {
        setTicketCount(result.count)
        alert(`Total de boletos en la base de datos: ${result.count}`)
      } else {
        alert(`Error al verificar boletos: ${result.error}`)
      }
    } catch (error) {
      console.error("Error checking tickets:", error)
      alert("Error al verificar boletos")
    } finally {
      setCheckingTickets(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-gray-400 text-gray-800 border-gray-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Vendido
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        </div>

        <Card className="w-full max-w-md relative z-10 shadow-2xl border-slate-700 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                Panel de Administración
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Ingresa tus credenciales para acceder
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-600" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-slate-50 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-600" />
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-slate-50 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{loginError}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-lg shadow-lg"
              >
                <Shield className="mr-2 h-5 w-5" />
                Iniciar Sesión
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-transparent border-slate-300 hover:bg-slate-50"
                onClick={() => router.push("/")}
              >
                Volver al Inicio
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
            <p className="text-gray-600">Gestiona boletos y marca como vendidos</p>
            {ticketCount !== null && (
              <p className="text-sm text-green-600 font-semibold mt-1">
                ✓ {ticketCount.toLocaleString()} boletos en la base de datos
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCheckTickets}
              disabled={checkingTickets}
              variant="outline"
              className="gap-2 bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100"
            >
              <Ticket className="h-4 w-4" />
              {checkingTickets ? "Verificando..." : "Verificar Boletos"}
            </Button>
            <Button
              onClick={handleSeedDatabase}
              disabled={seeding}
              variant="outline"
              className="gap-2 bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
            >
              <Database className="h-4 w-4" />
              {seeding ? "Inicializando..." : "Inicializar Boletos"}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Pendientes</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingPurchases}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gray-200 rounded-lg">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Vendidos</h3>
            </div>
            <p className="text-2xl font-bold text-gray-600">{stats.approvedPurchases}</p>
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
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Boletos</h2>
            <p className="text-gray-600">Revisa, marca como vendidos o elimina compras</p>
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
                    className={`border ${purchase.status === "pending" ? "border-yellow-200 bg-yellow-50" : "border-gray-300 bg-gray-100"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Compra #{purchase.id.slice(0, 13).toUpperCase()}</CardTitle>
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
                                <DialogTitle>Detalles de Compra #{purchase.id.slice(0, 13).toUpperCase()}</DialogTitle>
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
                                    <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                                      {selectedPurchase.ticket_numbers.map((ticketNum: string, index: number) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className={`text-xs ${selectedPurchase.status === "approved" ? "bg-gray-300 text-gray-700" : "bg-slate-100 text-slate-700"}`}
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
                                        onClick={() => handleMarkAsSold(selectedPurchase.id)}
                                        disabled={updating || selectedPurchase.status === "approved"}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {selectedPurchase.status === "approved" ? "Ya Vendido" : "Marcar como Vendido"}
                                      </Button>
                                      <Button
                                        onClick={() => handleMarkAsPending(selectedPurchase.id)}
                                        disabled={updating || selectedPurchase.status === "pending"}
                                        variant="outline"
                                        className="flex-1 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                      >
                                        <Clock className="h-4 w-4 mr-2" />
                                        {selectedPurchase.status === "pending" ? "Ya Pendiente" : "Marcar Pendiente"}
                                      </Button>
                                    </div>
                                    <Button
                                      onClick={() => handleDeletePurchase(selectedPurchase.id)}
                                      disabled={updating}
                                      variant="outline"
                                      className="w-full border-red-500 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Eliminar Compra
                                    </Button>
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
