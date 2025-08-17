import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Panel de Administración - RafflePro",
  description: "Manage purchases, approve payments, and oversee raffle operations",
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminDashboard />
    </div>
  )
}
