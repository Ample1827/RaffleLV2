import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { PrizesShowcase } from "@/components/sections/prizes-showcase"
import { TicketBenefits } from "@/components/sections/ticket-benefits"
import { Stats } from "@/components/sections/stats"
import { Testimonials } from "@/components/sections/testimonials"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"
import { PrizesTab } from "@/components/sections/prizes-tab"
import { BuyTickets } from "@/components/sections/buy-tickets"
import { ValidateTickets } from "@/components/sections/validate-tickets"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <PrizesShowcase />
        <PrizesTab />
        <BuyTickets />
        <ValidateTickets />
        <TicketBenefits />
        <Stats />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
