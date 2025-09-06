import { CreateForm } from "./_components/create-form";
import { FormsFilter } from "./_components/forms-filter";
import { getTreatmentsAction } from "@/lib/api/actions/treatment";
import { Suspense } from "react";
import { FormItemSkeleton } from "./_components/form-item-skeleton";
import { FormsList } from "./_components/forms-list";

export const dynamic = "force-dynamic";

type FormsProps = {
  searchParams: Promise<{
    name?: string;
    treatmentIds?: string;
  }>;
}

export default async function FormsPage(props: FormsProps) {
  const searchParams = await props.searchParams
  const treatments = await getTreatmentsAction()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Formulários</h1>
        <CreateForm />
      </div>
      <FormsFilter treatments={treatments} />
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Todos os Formulários</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tratamentos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Externo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <Suspense fallback={
              <tbody className="bg-white divide-y divide-gray-200">
                <FormItemSkeleton />
                <FormItemSkeleton />
                <FormItemSkeleton />
                <FormItemSkeleton />
                <FormItemSkeleton />
              </tbody>
            }>
              <FormsList name={searchParams.name} treatment_ids={searchParams.treatmentIds}  />
            </Suspense>
          </table>
        </div>
      </div>
    </div>
  )
}