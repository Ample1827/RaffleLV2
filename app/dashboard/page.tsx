import type { Metadata } from "next"
import { AuthProtectedDashboard } from "@/components/dashboard/auth-protected-dashboard"

export const metadata: Metadata = {
  title: "Dashboard - RafflePro",
  description: "Manage your tickets, entries, and purchases",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AuthProtectedDashboard />
    </div>
  )
}
