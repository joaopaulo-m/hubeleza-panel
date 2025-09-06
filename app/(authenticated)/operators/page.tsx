import { getOperatorsAction } from "@/lib/api/actions/operator";
import { CreateOperatorForm } from "./_components/create-operator-form";
import { OperatorItem } from "./_components/operator-item";

export const dynamic = "force-dynamic";

export default async function OperatorsPage() {
  const operators = await getOperatorsAction()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Operadores</h1>
        <CreateOperatorForm />
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Todos os operadores</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado por</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operators.map(operator => (
                <OperatorItem
                  key={operator.id}
                  operator={operator}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}