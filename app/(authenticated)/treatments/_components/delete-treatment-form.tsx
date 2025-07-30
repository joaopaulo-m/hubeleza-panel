'use client'

import { toast } from "sonner";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteTreatmentAction } from "@/lib/api/actions/treatment";

interface DeleteTreatmentProps {
  treatment_id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTreatmentForm(props: DeleteTreatmentProps) {
  async function onDeleteTreatmentClick() {
    try {
      await deleteTreatmentAction(props.treatment_id)

      toast.success("Tratamento deletado com sucesso")
    } catch {
      toast.error("Erro ao deletar tratamento")
    } finally {
      props.onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja deletar o tratamento?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteTreatmentClick}>Deletar tratamento</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}