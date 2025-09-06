'use client'

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { exportPartnersAction } from "@/lib/api/actions/partner"
import { FileSpreadsheet } from "lucide-react"

interface ExportPartnersBtnProps {
  name?: string
  city?: string
  state?: string
  status?: string
  startDate?: string
  endDate?: string
  treatment_ids?: string
}

export function ExportPartnersBtn(props: ExportPartnersBtnProps) {
  async function onClickHandler() {
    try {
      const blob = await exportPartnersAction(props)
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'parceiros.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting: ", error)
      toast.error("Erro ao exportar parceiros", {
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