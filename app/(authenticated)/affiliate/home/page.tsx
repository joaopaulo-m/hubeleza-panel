import { getAffiliateDashboardDataAction } from "@/lib/api/actions/dashboard";
import { AffiliateWalletCard } from "./_components/affiliate-wallet-card";
import { getAffiliateWalletAction } from "@/lib/api/actions/affiliate-wallet";
import { AffiliateFastActionsCard } from "./_components/fast-actions-card";
import { AffiliateDashboardCards } from "./_components/affiliate-dashboard-cards";
import AffiliateLinkCopy from "./_components/affiliate-link-copy";
import { getAffiliate } from "@/lib/api/actions/affiliate";

export const dynamic = 'force-dynamic';

export default async function AffiliateHomePage() {
  const affiliate = await getAffiliate()
  const wallet = await getAffiliateWalletAction()
  const data = await getAffiliateDashboardDataAction()

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="w-full h-fit flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
            Página inicial
          </h1>
          <AffiliateLinkCopy affiliate_code={affiliate.referral_code} />
        </div>

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

