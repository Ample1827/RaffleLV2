import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { TicketPackages } from "@/components/sections/ticket-packages"

export const metadata: Metadata = {
  title: "Buy Tickets - RafflePro",
  description: "Choose your ticket package and join the raffle",
}

export default function BuyTicketsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
            Choose Your <span className="text-amber-600">Ticket Package</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select from our premium ticket packages or customize your own. More tickets mean better chances to win!
          </p>
        </div>
        <TicketPackages />
      </div>
    </div>
  )
}
