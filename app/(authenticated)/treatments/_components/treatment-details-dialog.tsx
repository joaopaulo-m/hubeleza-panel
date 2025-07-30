import { Activity } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { TreatmentData } from "@/types/entities/dashboard"

interface TreatmentDetailsDialogProps {
  name: string
  data: TreatmentData
}

export function TreatmentDetailsDialog({ name, data }: TreatmentDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
          Ver Detalhes
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            {name}
          </DialogTitle>
          <DialogDescription>Informações completas do parceiro.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700 mt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Formulários:</span>
            <span className="text-gray-900">{data.form_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Parceiros:</span>
            <span className="text-gray-900">{data.partner_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Total de leads:</span>
            <span className="text-gray-900">{data.lead_count}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
