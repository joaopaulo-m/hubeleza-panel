'use client'

import { ArrowDown, ArrowUp } from "lucide-react";

import type { Transaction } from "@/types/entities/transaction";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TransactionDialog } from "./transaction-details-dialog";
import { useState } from "react";

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem(props: TransactionItemProps) {
  const { transaction } = props;

  const [open, setOpen] = useState(false)

  return (
    <>
      <tr key={transaction.id} onClick={() => setOpen(true)} className="hover:bg-gray-50 cursor-pointer">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {transaction.type === "INCOME" ? (
              <>
                <ArrowUp className="w-3 h-3 text-gray-400 mr-3" />
                <div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200/60 text-green-600">Entrada</div>
                </div>
              </>
            ) : (
              <>
                <ArrowDown className="w-3 h-3 text-gray-400 mr-3" />
                <div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200/60 text-purple-600">Saída</div>
                </div>
              </>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {transaction.status === "PENDING_PAYMENT" && "Aguardando pagamento"}
          {transaction.status === "PAID" && "Paga"}
          {transaction.status === "RECEIVED" && "Paga"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatCurrency(transaction.amount)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDate(transaction.created_at)}
        </td>
      </tr>
      <TransactionDialog
        open={open}
        onOpenChange={setOpen}
        transaction={transaction}
      />
    </>
  )
}