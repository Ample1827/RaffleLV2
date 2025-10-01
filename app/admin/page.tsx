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
import { getAllPurchases, updatePurchaseStatus } from "@/lib/database"
import { ShoppingCart, Clock, CheckCircle, Calendar, Ticket, DollarSign, LogOut } from "lucide-react"

interface AdminStats {
  totalPurchases: number
  pendingPurchases: number
  boughtPurchases: number
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
    boughtPurchases: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null)
  const [updating, setUpdating] = useState(false)
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

  const handleMarkAsSold = async (purchaseId: string) => {
    setUpdating(true)
    try {
      console.log("[v0] Marking purchase as sold:", purchaseId)
      await updatePurchaseStatus(purchaseId, "bought")
      await fetchAdminData() // Refresh data
      setSelectedPurchase(null)
      alert("Boletos marcados como vendidos exitosamente")
    } catch (error) {
      console.error("[v0] Error updating purchase status:", error)
      alert("Error al actualizar el estado de la compra")
    } finally {
      setUpdating(false)
    }
  }

  const handleMarkAsPending = async (purchaseId: string) => {
    setUpdating(true)
    try {
      console.log("[v0] Marking purchase as pending:", purchaseId)
      await updatePurchaseStatus(purchaseId, "pending")
      await fetchAdminData() // Refresh data
      setSelectedPurchase(null)
      alert("Boletos marcados como pendientes exitosamente")
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
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "bought":
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">Ingresa tus credenciales para acceder al panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && <p className="text-sm text-red-500">{loginError}</p>}
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                Iniciar Sesión
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
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
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
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
            <p className="text-2xl font-bold text-gray-600">{stats.boughtPurchases}</p>
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
            <p className="text-gray-600">Revisa y marca boletos como vendidos</p>
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
                                          className={`text-xs ${selectedPurchase.status === "bought" ? "bg-gray-300 text-gray-700" : "bg-slate-100 text-slate-700"}`}
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
                                        disabled={updating || selectedPurchase.status === "bought"}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {selectedPurchase.status === "bought" ? "Ya Vendido" : "Marcar como Vendido"}
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
