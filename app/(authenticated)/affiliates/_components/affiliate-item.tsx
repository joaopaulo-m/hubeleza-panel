import { User2 } from "lucide-react";

import type { Affiliate } from "@/types/entities/affiliate";
import { EditAffiliateForm } from "./edit-affiliate-form";
import { DeleteAffiliateForm } from "./delete-affiliate-form";
import { formatCurrency } from "@/lib/utils";
import { AffiliateStatus } from "@/types/enums/affiliate-status";
import { Badge } from "@/components/ui/badge";

interface AffiliateItemProps {
  affiliate: Affiliate
}

const STATUS_CONFIG = {

  [AffiliateStatus.CONFIRMATION_PENDING]: {
    label: "Confirmação Pendente", 
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  [AffiliateStatus.ACTIVE]: {
    label: "Ativo",
    color: "bg-green-50 text-green-700 border-green-200"
  },
  [AffiliateStatus.CANCELED]: {
    label: "Cancelado",
    color: "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export function AffiliateItem(props: AffiliateItemProps) {
  const { affiliate } = props;

  return (
    <tr key={affiliate.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <User2 className="w-5 h-5 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {affiliate.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant="outline" className={STATUS_CONFIG[affiliate.status].color}>
          {STATUS_CONFIG[affiliate.status].label}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/8 text-primary">
          {affiliate.referral_code}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {affiliate.comission_percentage}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {affiliate.lead_comission_amount ? formatCurrency(affiliate.lead_comission_amount) : "*"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <EditAffiliateForm affiliate={affiliate} />
          <DeleteAffiliateForm affiliate_id={affiliate.id} />
        </div>
      </td>
    </tr>
  )
}