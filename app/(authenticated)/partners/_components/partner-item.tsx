import { Building2, Edit, MapPin, MoreHorizontal } from "lucide-react"

import type { Partner } from "@/types/entities/partner"
import { PartnerDetailsDialog } from "./partner-details-dialog"
import { PartnerItemOptions } from "./partner-item-options"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { PartnerStatus } from "@/types/enums/partner-status"

interface PartnerItemProps {
  partner: Partner
}

const STATUS_CONFIG = {
  [PartnerStatus.PAYMENT_PENDING]: {
    label: "Pagamento Pendente",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200"
  },
  [PartnerStatus.CONFIRMATION_PENDING]: {
    label: "Confirmação Pendente", 
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  [PartnerStatus.ACTIVE]: {
    label: "Ativo",
    color: "bg-green-50 text-green-700 border-green-200"
  },
  [PartnerStatus.RECHARGE_REQUIRED]: {
    label: "Recarga Necessária",
    color: "bg-orange-50 text-orange-700 border-orange-200"
  },
  [PartnerStatus.SUSPENDED]: {
    label: "Suspenso",
    color: "bg-red-50 text-red-700 border-red-200"
  },
  [PartnerStatus.CANCELED]: {
    label: "Cancelado",
    color: "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export const PartnerItem = (props: PartnerItemProps) => {
  const { partner } = props

  return (
    <Link href={`/partners/${partner.id}`} key={partner.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{partner.name}</h4>
            <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{partner.cep}</span>
            </div>
          </div>
        </div>
        <PartnerItemOptions 
          partner_id={partner.id}
        />
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Telefone:</span>
          <span className="text-gray-900">{partner.phone_number}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Status:</span>
          <Badge variant="outline" className={STATUS_CONFIG[partner.status].color}>
            {STATUS_CONFIG[partner.status].label}
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <PartnerDetailsDialog partner={partner} />
      </div>
    </Link>
  )
}