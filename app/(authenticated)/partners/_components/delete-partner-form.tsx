'use client'

import { toast } from "sonner";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deletePartnerAction } from "@/lib/api/actions/partner";

interface DeletePartnerProps {
  partner_id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePartner(props: DeletePartnerProps) {
  async function onDeletePartnerClick() {
    try {
      await deletePartnerAction(props.partner_id)

      toast.success("Partner deletado com sucesso")
    } catch {
      toast.error("Erro ao deletar partner")
    } finally {
      props.onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja deletar o partner?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDeletePartnerClick}>Deletar partner</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}