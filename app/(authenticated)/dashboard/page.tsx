import { getAdminDashboardDataAction } from "@/lib/api/actions/dashboard"
import { AdminStatsCards } from "./_components/admin-stats-cards"
import { TopTreatmentsChart } from "./_components/top-treatments-chart"
import { TopPartnersLeadsChart } from "./_components/top-partners-leads-chart"
import { TopPartnersDepositChart } from "./_components/top-partners-by-deposit-chart"

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const dashboardData = await getAdminDashboardDataAction()

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <div className="text-sm text-muted-foreground">
            Visão geral do sistema
          </div>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards data={dashboardData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Top Partners by Leads */}
          <div className="lg:col-span-1 xl:col-span-1">
            <TopPartnersLeadsChart data={dashboardData.top_partners_by_leads} />
          </div>
          
          {/* Top Treatments */}
          <div className="lg:col-span-1 xl:col-span-1">
            <TopTreatmentsChart data={dashboardData.top_treatments} />
          </div>


          {/* Top Partners by Deposit */}
          <div className="lg:col-span-2 xl:col-span-1">
            <TopPartnersDepositChart data={dashboardData.top_partners_by_deposit} />
          </div>
        </div>
      </div>
    </div>
  )
}