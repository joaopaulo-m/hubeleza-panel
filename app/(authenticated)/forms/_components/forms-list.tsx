import { getFormsAction } from "@/lib/api/actions/form"
import { FormItem } from "./form-item"

interface FormsListProps {
  name?: string
  treatment_ids?: string
}

export async function FormsList(props: FormsListProps) {
  const forms = await getFormsAction(props)

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {forms.map((form) => (
        <FormItem
          key={form.id}
          form={form}
        />
      ))}
    </tbody>
  )
}