import type { Metadata } from "next"
import { PrizeViewingSystem } from "@/components/sections/prize-viewing-system"

export const metadata: Metadata = {
  title: "View Prizes - RafflePro",
  description: "Browse all available prizes and current raffles",
}

export default function PrizesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Browse All <span className="text-gold">Prizes</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover amazing prizes across different categories. Filter by value, category, or time remaining.
          </p>
        </div>
        <PrizeViewingSystem />
      </div>
    </div>
  )
}
