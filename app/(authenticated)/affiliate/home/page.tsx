import { getAffiliateDashboardDataAction } from "@/lib/api/actions/dashboard";
import { AffiliateWalletCard } from "./_components/affiliate-wallet-card";
import { getAffiliateWalletAction } from "@/lib/api/actions/affiliate-wallet";
import { AffiliateFastActionsCard } from "./_components/fast-actions-card";
import { AffiliateDashboardCards } from "./_components/affiliate-dashboard-cards";

export const dynamic = 'force-dynamic';

export default async function AffiliateHomePage() {
  const wallet = await getAffiliateWalletAction()
  const data = await getAffiliateDashboardDataAction()

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
            <AffiliateWalletCard wallet={wallet} />
            <AffiliateFastActionsCard />
          </div>
          <AffiliateDashboardCards 
            data={data}
          />
        </div>
      </div>
    </div>
  )
}

