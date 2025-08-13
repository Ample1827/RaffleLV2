import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { PrizesShowcase } from "@/components/sections/prizes-showcase"
import { TicketPackages } from "@/components/sections/ticket-packages"
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
        <section className="py-24 bg-background relative">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Choose Your Ticket Package
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Select from our premium packages or generate lucky numbers
              </p>
            </div>
            <TicketPackages />
          </div>
        </section>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
