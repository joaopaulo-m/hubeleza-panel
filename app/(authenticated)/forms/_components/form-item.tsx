import { FileText } from "lucide-react";

import type { Form } from "@/types/entities/form"
import { DeleteForm } from "./delete-form";
import { EditForm } from "./edit-form";
import type { Treatment } from "@/types/entities/treatment";

interface FormItemProps {
  form: Form
}

export function FormItem(props: FormItemProps) {
  const { form } = props;

  return (
    <tr key={form.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">{form.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/8 text-primary">
          {form.treatments.map(treatment => treatment.name).join(", ")}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {form.external_form_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        *
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <EditForm form={form}  />
          <DeleteForm form_id={form.id} />
        </div>
      </td>
    </tr>
  )
}