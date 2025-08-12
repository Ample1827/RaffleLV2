import type { Metadata } from "next"
import { TicketPackages } from "@/components/sections/ticket-packages"

export const metadata: Metadata = {
  title: "Buy Tickets - RafflePro",
  description: "Choose your ticket package and join the raffle",
}

export default function BuyTicketsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Choose Your <span className="text-gold">Ticket Package</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select from our premium ticket packages or customize your own. More tickets mean better chances to win!
          </p>
        </div>
        <TicketPackages />
      </div>
    </div>
  )
}
