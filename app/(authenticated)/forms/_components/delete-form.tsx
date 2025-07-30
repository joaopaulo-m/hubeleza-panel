'use client'

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteFormAction } from "@/lib/api/actions/form";

interface DeleteFormProps {
  form_id: string
}

export function DeleteForm(props: DeleteFormProps) {
  const [open, setOpen] = useState(false)

  async function onDeleteFormClick() {
    try {
      await deleteFormAction(props.form_id)

      toast.success("Formulário deletado com sucesso")
    } catch {
      toast.error("Erro ao deletar formulário")
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
          <AlertDialogTitle>Tem certeza que deseja deletar formulário?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteFormClick}>Deletar formulário</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}