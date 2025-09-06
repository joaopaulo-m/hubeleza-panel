import { CreateInviteForm } from "./_components/create-invite";
import { InvitesFilter } from "./_components/invites-filter";
import { InvitesList } from "./_components/invites-list";

export const dynamic = "force-dynamic";

type InvitesPageProps = {
  searchParams: Promise<{
    name?: string;
    startDate?: string;
    endDate?: string
  }>;
}

export default async function InvitesPage(props: InvitesPageProps) {
  const searchParams = await props.searchParams

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Convites</h1>
        <CreateInviteForm />
      </div>
      <InvitesFilter />
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Todos os convites</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data criação</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <InvitesList {...searchParams} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}