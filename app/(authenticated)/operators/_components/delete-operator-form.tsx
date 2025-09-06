'use client'

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteFormAction } from "@/lib/api/actions/form";
import { deleteOperatorAction } from "@/lib/api/actions/operator";

interface DeleteOperatorProps {
  operator_id: string
}

export function DeleteOperatorForm(props: DeleteOperatorProps) {
  const [open, setOpen] = useState(false)

  async function onDeleteOperatorClick() {
    try {
      deleteOperatorAction(props.operator_id)

      toast.success("Operador deletado com sucesso")
    } catch {
      toast.error("Erro ao deletar operador")
    } finally {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="text-red-600 hover:text-red-900">
          <Trash2 className="w-4 h-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja deletar operador?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteOperatorClick}>Deletar operador</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}