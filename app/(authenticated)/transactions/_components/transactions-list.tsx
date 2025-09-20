import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getTransactionsAction } from "@/lib/api/actions/transaction";
import { formatCurrency } from "@/lib/utils";

type TransactionsListProps = {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  partnerName?: string;
  leadName?: string;
  page?: string;
  limit?: string;
};

export async function TransactionsList(filters: TransactionsListProps) {
  const { items: transactions } = await getTransactionsAction({
    partner_name: filters.partnerName,
    lead_name: filters.leadName,
    status: filters.status,
    type: filters.type,
    start_date: filters.startDate,
    end_date: filters.endDate,
    min_amount: filters.minAmount,
    max_amount: filters.maxAmount
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      PAID: { variant: "default" as const, label: "Concluída", className: "bg-green-100 text-green-800" },
      PENDING_PAYMENT: { variant: "secondary" as const, label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
      PENDING_RECEIPT: { variant: "destructive" as const, label: "Falhada", className: "bg-red-100 text-red-800" },
    };
    
    return variants[status as keyof typeof variants];
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      INCOME: { label: "Crédito", className: "bg-blue-100 text-blue-800" },
      EXPENSE: { label: "Débito", className: "bg-purple-100 text-purple-800" },
    };
    
    return variants[type as keyof typeof variants] || { label: type, className: "bg-gray-100 text-gray-800" };
  };

  if (transactions.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="px-6 py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma transação encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros para ver mais resultados.</p>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {transactions.map((transaction) => {
        const statusBadge = getStatusBadge(transaction.status);
        const typeBadge = getTypeBadge(transaction.type);
        
        return (
          <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-900">
                  {transaction.id.slice(0, 5)}
                </div>
                <div className="text-xs text-gray-500">
                  Wallet: {transaction.wallet_id.slice(0, 5)}
                </div>
              </div>
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap"> 
              <Badge className={typeBadge.className}>
                {typeBadge.label}
              </Badge>
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge className={statusBadge.className}>
                {statusBadge.label}
              </Badge>
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <div className={`text-sm font-semibold ${
                  transaction.type === 'INCOME'
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
                {transaction.bonus_amount && (
                  <div className="text-xs text-green-600">
                    Bônus: +{formatCurrency(transaction.bonus_amount)}
                  </div>
                )}
                {transaction.lead_price && (
                  <div className="text-xs text-gray-500">
                    Lead: {formatCurrency(transaction.lead_price)}
                  </div>
                )}
              </div>
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap">
              {transaction.lead ? (
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.lead.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.lead.phone_number}
                  </div>
                  <div className="text-xs text-gray-400">
                    CEP: {transaction.lead.cep}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-gray-400">-</span>
              )}
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <div className="text-sm text-gray-900">
                  {format(new Date(transaction.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(transaction.created_at), 'HH:mm', { locale: ptBR })}
                </div>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  )
}