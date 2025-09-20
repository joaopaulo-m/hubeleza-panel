import { User2 } from "lucide-react";

import type { Operator } from "@/types/entities/operator";
import { EditOperatorForm } from "./edit-operator-form";
import { DeleteOperatorForm } from "./delete-operator-form";

interface OperatorItemProps {
  operator: Operator
}

export function OperatorItem(props: OperatorItemProps) {
  const { operator } = props;

  return (
    <tr key={operator.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <User2 className="w-5 h-5 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">{operator.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 line-clamp-1">
        <span title={operator.email} className="inline-text truncate max-w-10 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/8 text-primary">
          {operator.email}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {operator.sign_up_comission_percentage}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {operator.topup_comission_percentage}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {operator.created_by}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <EditOperatorForm operator={operator} />
          <DeleteOperatorForm operator_id={operator.id} />
        </div>
      </td>
    </tr>
  )
}