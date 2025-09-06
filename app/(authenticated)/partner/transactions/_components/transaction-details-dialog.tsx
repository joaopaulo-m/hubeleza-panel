"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Transaction } from "@/types/entities/transaction"
import { formatDate } from "@/lib/utils"

interface TransactionDialogProps {
  transaction: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDialog({ transaction, open, onOpenChange }: TransactionDialogProps) {
  const { lead, amount, lead_price, status, type, created_at } = transaction

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Transação</DialogTitle>
          <DialogDescription>
            Visualize as informações do lead e valores desta transação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Status</h4>
            <Badge variant="outline">  
              {status === "PENDING_PAYMENT" && "Aguardando pagamento"}
              {status === "PAID" && "Paga"}
              {status === "RECEIVED" && "Paga"}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Tipo</h4>
            <p className="text-muted-foreground capitalize">
              {type === "INCOME" && "Entrada"}
              {type === "EXPENSE" && "Saída"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Data</h4>
            <p>{formatDate(created_at)}</p>
          </div>


          {lead && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Informações do Lead</h4>

                <div>
                  <span className="font-medium">Nome:</span> {lead.name}
                </div>

                <div>
                  <span className="font-medium">Telefone:</span> {lead.phone_number}
                </div>

                <div>
                  <span className="font-medium">CEP:</span> {lead.cep}
                </div>

                <div>
                  <span className="font-medium">Data de Criação:</span> {formatDate(lead.created_at)}
                </div>

                {lead.treatments.length > 0 && (
                  <div>
                    <span className="font-medium">Tratamentos:</span>
                    <ul className="list-disc ml-5 mt-1">
                      {lead.treatments.map((treatment, index) => (
                        <li key={index}>{treatment.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Separator />
              
              <div>
                <h4 className="text-sm font-semibold text-foreground">Preço do Lead</h4>
                <p className="text-lg font-bold text-foreground">
                  R$ {(lead_price ?? amount / 100).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
