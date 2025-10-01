import { Suspense } from "react";

import { AffiliateTransactionsFilter } from "./_components/affiliate-transactions-filter";
import { AffiliateTransactionItemSkeleton } from "./_components/affiliate-transaction-item-skeleton";
import { AffiliateTransactionsList } from "./_components/affiliate-transactions-list";

export const dynamic = "force-dynamic";

type AffiliateTransactionsPageProps = {
  searchParams: Promise<{
    name?: string;
    type?: string;
    startDate?: string;
    endDate?: string
  }>;
}

export default async function AffiliateTransactionsPage(props: AffiliateTransactionsPageProps) {
  const params = await props.searchParams

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
      </div>
      <AffiliateTransactionsFilter />
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Todas as Transações</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parceiro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor comissão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <Suspense fallback={
                <>
                  <AffiliateTransactionItemSkeleton />
                  <AffiliateTransactionItemSkeleton />
                  <AffiliateTransactionItemSkeleton />
                  <AffiliateTransactionItemSkeleton />
                  <AffiliateTransactionItemSkeleton />
                </>
              }>
                <AffiliateTransactionsList {...params} />
              </Suspense>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}