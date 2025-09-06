import { getWalletAction } from "@/lib/api/actions/wallet"
import { WalletCard } from "./_components/ wallet-card"
import { getPartnerDashboardDataAction } from "@/lib/api/actions/dashboard"
import PartnerDashboardCards from "./_components/partner-dashboard-cards"
import { FastActionsCard } from "./_components/fast-actions-card"

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const wallet = await getWalletAction()
  const dashboardData = await getPartnerDashboardDataAction()

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
          Página inicial
        </h1>

        {/* Main Stats Grid */}
        <div className="w-full flex flex-col gap-6">
          {/* Wallet Card - Interactive */}
          <div className="w-full grid grid-cols-3 gap-6 items-center">
            <WalletCard 
              wallet={wallet}
            />
            <FastActionsCard />
          </div>
          <PartnerDashboardCards 
            data={dashboardData}
          />
        </div>
      </div>
    </div>
  )
}

