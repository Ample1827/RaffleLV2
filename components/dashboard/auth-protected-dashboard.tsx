"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Ticket, ShoppingCart } from "lucide-react"

export function AuthProtectedDashboard() {
  const { user, loading } = useAuth()

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user.user_metadata?.full_name || user.phone}
          </h1>
          <p className="text-gray-600">Gestiona tus boletos y compras desde aquí</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Ticket className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Mis Boletos</h3>
            </div>
            <p className="text-3xl font-bold text-amber-600 mb-2">0</p>
            <p className="text-sm text-gray-600">Boletos activos</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Compras</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">$0</p>
            <p className="text-sm text-gray-600">Total gastado</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Ticket className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sorteos</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">0</p>
            <p className="text-sm text-gray-600">Participaciones activas</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/buy-tickets">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white">
                Comprar Boletos
              </Button>
            </Link>
            <Link href="/verify-tickets">
              <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent">
                Verificar Boletos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
