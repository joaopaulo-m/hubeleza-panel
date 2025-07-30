import { Building2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Partner } from "@/types/entities/partner"

interface PartnerDetailsDialogProps {
  partner: Partner
}

export function PartnerDetailsDialog({ partner }: PartnerDetailsDialogProps) {
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
            <Building2 className="w-5 h-5 text-blue-600" />
            {partner.name}
          </DialogTitle>
          <DialogDescription>Informações completas do parceiro.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700 mt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">CEP:</span>
            <span className="text-gray-900">{partner.cep}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Telefone:</span>
            <span className="text-gray-900">{partner.phone_number}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Tratamentos:</span>
            <span className="text-gray-900">{partner.treatments.map(treatment => treatment.name).join(", ")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
