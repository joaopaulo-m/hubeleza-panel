import { getCurrentPartnerLeadsAction } from "@/lib/api/actions/lead";
import { LeadItem } from "./lead-item";
import { LeadsPagination } from "./leads-pagination";

interface LeadsGridProps {
  searchParams: {
    startDate?: string;
    endDate?: string;
    name?: string;
    treatmentIds?: string;
    page?: string;
  };
}

export async function LeadsGrid(props: LeadsGridProps) {
  const startDate = props.searchParams.startDate;
  const endDate = props.searchParams.endDate;
  const name = props.searchParams.name;
  const treatmentIds = props.searchParams.treatmentIds;
  const page = props.searchParams.page || "1";

  const leads = await getCurrentPartnerLeadsAction({
    start_date: startDate,
    end_date: endDate,
    name,
    treatment_ids: treatmentIds,
    page,
  })

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Todos os Leads
              {leads.data && leads.data.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({leads.total} {leads.total === 1 ? 'lead' : 'leads'})
                </span>
              )}
            </h3>
          </div>
        </div>
        
        {!leads.data || leads.data.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {name || startDate || endDate || treatmentIds
                ? "Não há leads para os filtros selecionados. Tente ajustar os filtros."
                : "Você ainda não possui leads cadastrados."
              }
            </p>
          </div>
        ) : (
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
                {leads.data.map((lead) => (
                  <LeadItem key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {leads.data && leads.data.length > 0 && (
        <LeadsPagination
          currentPage={parseInt(page)}
          totalPages={leads.totalPages || 1}
          totalItems={leads.total || 0}
        />
      )}
    </>
  )
}
