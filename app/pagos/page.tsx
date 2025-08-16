import { Navbar } from "@/components/navbar"
import { PaymentInfo } from "@/components/sections/payment-info"

export default function PagosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
      <Navbar />
      <PaymentInfo />
    </div>
  )
}
