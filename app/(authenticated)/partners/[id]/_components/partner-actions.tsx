"use client"

import React, { useState } from "react"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  AlertCircle, 
  Mail,
  Key,
  CreditCard,
  RefreshCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { PartnerStatus } from "@/types/enums/partner-status"
import { toast } from "sonner"
import { deletePartnerAction } from "@/lib/api/actions/partner"
import { useRouter } from "next/navigation"
import type { Partner } from "@/types/entities/partner"
import { UpdatePartnerForm } from "../../_components/update-partner-form"
import { UpdatePartnerStatusForm } from "./update-partner-status-form"

interface PartnerActionsProps {
  partner: Partner
  status: PartnerStatus
}

export function PartnerActions({ partner, status }: PartnerActionsProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showUpdateStatusDialog, setShowUpdateStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deletePartnerAction(partner.id)
      setShowDeleteDialog(false)
      router.push("/partners")

      toast.success("Parceiro deletado com sucesso")
    } catch (error) {
      toast.error("Erro ao deletar parceiro", {
        description: "Tente novamente mais tarde"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Ações básicas */}
          <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Ações de status */}
          <DropdownMenuItem onClick={() => setShowUpdateStatusDialog(true)}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Alterar status
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Ações perigosas */}
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Parceiro
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Deletar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle>Excluir Parceiro</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todos os dados do parceiro serão permanentemente removidos.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 my-4">
            <p className="text-sm text-red-700">
              <strong>Aviso:</strong> Esta ação é irreversível e removerá:
            </p>
            <ul className="text-sm text-red-600 mt-2 space-y-1 ml-4">
              <li>• Perfil e dados do parceiro</li>
              <li>• Histórico de transações</li>
              <li>• Histórico de leads recebidos</li>
              <li>• Configurações da wallet</li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Excluindo..." : "Excluir Permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpdatePartnerStatusForm 
        open={showUpdateStatusDialog}
        onOpenChange={setShowUpdateStatusDialog}
        partner={partner}
      />

      <UpdatePartnerForm
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        partner={partner}
      />
    </>
  )
}