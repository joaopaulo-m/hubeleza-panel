import { Suspense } from "react";

import { AffiliatesList } from "./_components/affiliates-list";
import { AffiliateItemSkeleton } from "./_components/affiliate-item-skeleton";
import { AffiliatesFilter } from "./_components/affiliates-filter";
import { CreateAffiliateForm } from "./_components/create-affiliate-form";

interface AffiliatesPageProps {
  searchParams: Promise<{
    name?: string
    referralCode?: string
  }>
}

export const dynamic = "force-dynamic";

export default async function AffiliatesPage(props: AffiliatesPageProps) {
  const searchParams = await props.searchParams

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Afiliados</h1>
        <CreateAffiliateForm />
      </div>
      <AffiliatesFilter />
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Todos os afiliados</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comissão Cadastro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comissão Lead</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <Suspense fallback={
                <>
                  <AffiliateItemSkeleton />
                  <AffiliateItemSkeleton />
                  <AffiliateItemSkeleton />
                  <AffiliateItemSkeleton />
                  <AffiliateItemSkeleton />
                </>
              }>
                <AffiliatesList {...searchParams} />
              </Suspense>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}