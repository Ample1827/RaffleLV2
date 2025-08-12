import type { Metadata } from "next"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export const metadata: Metadata = {
  title: "Dashboard - RafflePro",
  description: "Manage your tickets, entries, and purchases",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <UserDashboard />
    </div>
  )
}
