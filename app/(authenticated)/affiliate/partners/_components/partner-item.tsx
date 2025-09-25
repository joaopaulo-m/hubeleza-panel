import { User } from "lucide-react";

import { formatDate } from "@/lib/utils";
import type { Partner } from "@/types/entities/partner";

interface AffiliatePartnerItemProps {
  partner: Partner
}

export function AffiliatePartnerItem(props: AffiliatePartnerItemProps) {
  const { partner } = props;

  return (
    <tr key={partner.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <User className="w-5 h-5 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">{partner.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {partner.company_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {partner.city}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {partner.state}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(partner.created_at)}
      </td>
    </tr>
  )
}