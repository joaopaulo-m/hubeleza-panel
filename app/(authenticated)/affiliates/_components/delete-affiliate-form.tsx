'use client'

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteAffiliateAction } from "@/lib/api/actions/affiliate";

interface DeleteAffiliateForm {
  affiliate_id: string
}

export function DeleteAffiliateForm(props: DeleteAffiliateForm) {
  const [open, setOpen] = useState(false)

  async function onDeleteFormClick() {
    try {
      await deleteAffiliateAction(props.affiliate_id)

      toast.success("Afiliado deletado com sucesso")
    } catch {
      toast.error("Erro ao deletar afiliado")
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
          <AlertDialogTitle>Tem certeza que deseja deletar afiliado?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteFormClick}>Deletar afiliado</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}