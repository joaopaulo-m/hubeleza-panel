"use client"

import { Building2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import type { Partner } from "@/types/entities/partner"
import { TransactionItem } from "../../partner/transactions/_components/transaction-item"
import { useEffect, useState } from "react"
import { Transaction } from "@/types/entities/transaction"
import { getTransactionsByPartnerIdAction } from "@/lib/api/actions/transaction"
import { cn } from "@/lib/utils"

interface PartnerDetailsDialogProps {
  partner: Partner
}

export function PartnerDetailsDialog({ partner }: PartnerDetailsDialogProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    async function fetchTransactions() {
      const transactions = await getTransactionsByPartnerIdAction(partner.id)

      setTransactions(transactions)
    }

    fetchTransactions()
  }, [partner])

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        <button className="flex-1 bg-primary/5 text-primary px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10">
          Ver Detalhes
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-hidden",
          partner.treatments.length > 0 && "w-[70vw] max-w-[70vw] min-w-[400px]"
        )}
        style={partner.treatments.length > 0 ? { width: '70vw', maxWidth: '70vw' } : undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-primary" />
            {partner.name}
          </DialogTitle>
          <DialogDescription>Informações completas do parceiro.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700 mt-4">
          <div className="flex items-center gap-5">
            <span className="font-medium">CEP:</span>
            <span className="text-gray-900">{partner.cep}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-medium">Telefone:</span>
            <span className="text-gray-900">{partner.phone_number}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-medium">Tratamentos:</span>
            <span className="text-gray-900">
              {partner.treatments.map(t => t.name).join(", ")}
            </span>
          </div>
        </div>

        {transactions?.length > 0 && (
          <>
            <Separator className="my-4" />
            <h3 className="text-sm font-semibold text-gray-800">Transações do parceiro</h3>

            <ScrollArea className="h-64 rounded-md border">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
