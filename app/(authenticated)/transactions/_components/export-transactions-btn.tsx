'use client'

import { toast } from "sonner"

import { FileSpreadsheet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTransactionsAction } from "@/lib/api/actions/transaction"

type ExportTransactionsBtnProps = {
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
}

export function ExportTransactionsBtn(props: ExportTransactionsBtnProps) {
  async function onClickHandler() {
    try {
      const blob = await exportTransactionsAction(props)
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting: ", error)
      toast.error("Erro ao exportar transações", {
        description: "Tente novamente mais tarde"
      })
    }
  }
  
  return (
    <Button
      variant='outline'
      className="px-4 py-2 rounded-lg flex items-center space-x-1 cursor-pointer"
      onClick={onClickHandler}
    >
      <FileSpreadsheet className="w-4 h-4" />
      <span>Exportar</span>
    </Button>
  )
}