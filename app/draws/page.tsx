import type { Metadata } from "next"
import { DrawEntrySystem } from "@/components/sections/draw-entry-system"

export const metadata: Metadata = {
  title: "Enter Draws - RafflePro",
  description: "Enter different raffle draws and manage your entries",
}

export default function DrawsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Enter <span className="text-gold">Different Draws</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose from multiple active draws and enter with your tickets. Each draw has different prizes and entry
            requirements.
          </p>
        </div>
        <DrawEntrySystem />
      </div>
    </div>
  )
}
