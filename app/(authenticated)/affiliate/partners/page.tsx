import { Suspense } from "react";

import { AffiliatePartnerItemSkeleton } from "./_components/partner-item-skeleton";
import { AffiliatePartnersList } from "./_components/partners-list";
import { AffiliatePartnersFilter } from "./_components/affiliate-partners-filter";

export const dynamic = "force-dynamic";

type AffiliatePartnersPageProps = {
  searchParams: Promise<{
    name?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function AffiliatePartnersPage(props: AffiliatePartnersPageProps) {
  const searchParams = await props.searchParams

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900">Seus parceiros</h1>
      </div>
      <AffiliatePartnersFilter />
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Todos parceiros criados por você</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome da empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <Suspense fallback={
              <tbody className="bg-white divide-y divide-gray-200">
                <AffiliatePartnerItemSkeleton />
                <AffiliatePartnerItemSkeleton />
                <AffiliatePartnerItemSkeleton />
                <AffiliatePartnerItemSkeleton />
                <AffiliatePartnerItemSkeleton />
              </tbody>
            }>
              <AffiliatePartnersList {...searchParams} />
            </Suspense>
          </table>
        </div>
      </div>
    </div>
  )
}