import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { TicketPackages } from "@/components/sections/ticket-packages"

export const metadata: Metadata = {
  title: "Comprar Boletos - Rifas Romero",
  description: "Elige tu paquete de boletos y únete a la rifa",
}

export default function BuyTicketsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
            Elige Tu <span className="text-amber-600">Paquete de Boletos</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Selecciona entre nuestros paquetes premium de boletos o personaliza el tuyo. ¡Más boletos significan mejores
            oportunidades de ganar!
          </p>
        </div>
        <TicketPackages />
      </div>
    </div>
  )
}
