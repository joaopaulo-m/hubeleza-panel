'use client'

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteInviteToken } from "@/lib/api/actions/invite-token";

interface DeleteInviteProps {
  invite_id: string
}

export function DeleteInvite(props: DeleteInviteProps) {
  const [open, setOpen] = useState(false)

  async function onDeleteInviteClick() {
    try {
      await deleteInviteToken(props.invite_id)

      toast.success("Convite deletado com sucesso")
    } catch {
      toast.error("Erro ao deletar convite")
    } finally {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="text-red-600 hover:text-red-900 cursor-pointer">
          <Trash2 className="w-4 h-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja deletar o convite?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteInviteClick}>Deletar convite</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}