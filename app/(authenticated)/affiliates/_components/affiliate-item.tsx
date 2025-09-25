import { User2 } from "lucide-react";

import type { Affiliate } from "@/types/entities/affiliate";
import { EditAffiliateForm } from "./edit-affiliate-form";
import { DeleteAffiliateForm } from "./delete-affiliate-form";

interface AffiliateItemProps {
  affiliate: Affiliate
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/8 text-primary">
          {affiliate.referral_code}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {affiliate.comission_percentage}%
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