import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { PrizesShowcase } from "@/components/sections/prizes-showcase"
import { BuyTickets } from "@/components/sections/buy-tickets"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <PrizesShowcase />
        <HowItWorks />
        <BuyTickets />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
