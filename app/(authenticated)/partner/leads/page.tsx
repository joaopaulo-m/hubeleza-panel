import { getTreatmentsAction } from "@/lib/api/actions/treatment";
import { LeadsFilters } from "./_components/leads-filter";
import { LeadsGrid } from "./_components/leads-grid";
import { Suspense } from "react";
import { LeadItemSkeleton } from "./_components/lead-item-skeleton";

export const dynamic = "force-dynamic";

type LeadsPageProps = {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    name?: string;
    treatmentIds?: string;
    page?: string;
  }>;
}

export default async function LeadsPage(props: LeadsPageProps) {
  const searchParams = await props.searchParams
  const treatments = await getTreatmentsAction()

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
      </div>
      <LeadsFilters treatments={treatments} />      
      <Suspense fallback={
        <>
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Todos os Leads
                </h3>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CEP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tratamentos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <LeadItemSkeleton />
                  <LeadItemSkeleton />
                  <LeadItemSkeleton />
                  <LeadItemSkeleton />
                  <LeadItemSkeleton />
                  <LeadItemSkeleton />
                </tbody>
              </table>
            </div>
          </div>
        </>
      }>
        <LeadsGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}