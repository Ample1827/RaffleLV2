import { Navbar } from "@/components/navbar"
import { ValidateTickets } from "@/components/sections/validate-tickets"
import { Footer } from "@/components/sections/footer"

export default function VerifyTicketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <ValidateTickets />
      </main>
      <Footer />
    </div>
  )
}
