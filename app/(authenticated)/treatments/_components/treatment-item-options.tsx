'use client'

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeleteTreatmentForm } from "./delete-treatment-form"

interface TreatmentItemProps {
  treatment_id: string
}
export function TreatmentItemOptions(props: TreatmentItemProps) {
  const [deleteTreatmentOpen, setDeleteTreatmentOpen] = useState(false)
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setDeleteTreatmentOpen(true)}>Deletar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteTreatmentForm
        treatment_id={props.treatment_id}
        open={deleteTreatmentOpen}
        onOpenChange={setDeleteTreatmentOpen}
      />
    </>
  )
}