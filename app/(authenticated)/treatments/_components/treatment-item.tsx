import { Activity } from "lucide-react"

import type { Treatment } from "@/types/entities/treatment"
import { EditTreatmentForm } from "./edit-treatment-form"
import { TreatmentItemOptions } from "./treatment-item-options"
import { getTreatmentDataAction } from "@/lib/api/actions/dashboard"
import { TreatmentDetailsDialog } from "./treatment-details-dialog"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export interface TreatmentItemProps {
  treatment: Treatment
}

export const TreatmentItem = async (props: TreatmentItemProps) => {
  const { treatment } = props
  const treatmentData = await getTreatmentDataAction(treatment.id)
  
  return (
    <div key={treatment.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-purple-600" />
        </div>
        <TreatmentItemOptions
          treatment_id={treatment.id}
        />
      </div> 
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{treatment.name}</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-base text-gray-500">Preço</span>
          <span className="text-base font-medium text-gray-950">{formatCurrency(treatment.price)}</span>
        </div>
        <Separator 
          className="w-full my-4"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Formulários</span>
          <span className="text-sm font-medium text-gray-900">{treatmentData.form_count}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Partners</span>
          <span className="text-sm font-medium text-gray-900">{treatmentData.partner_count}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total de Leads</span>
          <span className="text-sm font-medium text-green-600">{treatmentData.lead_count}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4">
        <div className="flex space-x-2">
          <TreatmentDetailsDialog 
            name={treatment.name}
            data={treatmentData}
          />
          <EditTreatmentForm treatment={props.treatment} />
        </div>
      </div>
    </div>
  )
}
