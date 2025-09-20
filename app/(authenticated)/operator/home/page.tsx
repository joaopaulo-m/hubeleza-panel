import { getOperatorWalletAction } from "@/lib/api/actions/operator-wallet";
import { OperatorFastActionsCard } from "./_components/fast-actions-card";
import { OperatorWalletCard } from "./_components/operator-wallet-card";
import { OperatorDashboardCards } from "./_components/operator-dashboard-cards";
import { getOperatorDashboardDataAction } from "@/lib/api/actions/dashboard";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const wallet = await getOperatorWalletAction()
  const data = await getOperatorDashboardDataAction()

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
            <OperatorWalletCard
              wallet={wallet}
            />
            <OperatorFastActionsCard />
          </div>
          <OperatorDashboardCards 
            data={data}
          />
        </div>
      </div>
    </div>
  )
}

