import { Building2, Edit, MapPin, MoreHorizontal } from "lucide-react"

import type { Partner } from "@/types/entities/partner"
import { PartnerDetailsDialog } from "./partner-details-dialog"
import { PartnerItemOptions } from "./partner-item-options"
import Link from "next/link"

interface PartnerItemProps {
  partner: Partner
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
          <span className="text-gray-500">Tratamentos:</span>
          <span className="text-gray-900">
            {
              partner.treatments
                .map(treatment => treatment.name)
                .join(", ")
            }
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <PartnerDetailsDialog partner={partner} />
      </div>
    </Link>
  )
}