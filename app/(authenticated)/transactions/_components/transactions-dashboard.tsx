import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, CreditCardIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionsDashboardDataAction } from "@/lib/api/actions/dashboard";
import { formatCurrency } from "@/lib/utils";

interface TransactionsDashboardProps {
  startDate?: string
  endDate?: string
}

export async function TransactionsDashboard(props: TransactionsDashboardProps) {
  const data = await getTransactionsDashboardDataAction({
    start_date: props.startDate,
    end_date: props.endDate
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Transações */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total de Transações
          </CardTitle>
          <CreditCardIcon className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {data.total_transactions.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center text-xs text-gray-600 mt-1">
            <TrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{data.monthly_growth}%</span>
            <span className="ml-1">vs mês anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Valor Total */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Valor Total
          </CardTitle>
          <ArrowUpIcon className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(data.total_amount)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Volume total processado
          </div>
        </CardContent>
      </Card>

      {/* Entradas (Créditos) */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Entradas
          </CardTitle>
          <ArrowUpIcon className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(data.total_credit)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Transações de crédito
          </div>
        </CardContent>
      </Card>

      {/* Saídas (Débitos) */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Saídas
          </CardTitle>
          <ArrowDownIcon className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(data.total_debit)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Transações de débito
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <div className="col-span-full">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Status das Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data.completed_transactions}
                </div>
                <div className="text-sm text-gray-600">Concluídas</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(data.completed_transactions / data.total_transactions) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {data.pending_transactions}
                </div>
                <div className="text-sm text-gray-600">Pendentes</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(data.pending_transactions / data.total_transactions) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {data.failed_transactions}
                </div>
                <div className="text-sm text-gray-600">Falharam</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(data.failed_transactions / data.total_transactions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}