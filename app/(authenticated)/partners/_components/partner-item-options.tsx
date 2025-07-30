'use client'

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeletePartner } from "./delete-partner-form"

interface PartnerItemOptionsProps {
  partner_id: string
}
export function PartnerItemOptions(props: PartnerItemOptionsProps) {
  const [deletePartnerOpen, seDeletePartnerOpen] = useState(false)
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => seDeletePartnerOpen(true)}>Deletar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePartner
        partner_id={props.partner_id}
        open={deletePartnerOpen}
        onOpenChange={seDeletePartnerOpen}
      />
    </>
  )
}