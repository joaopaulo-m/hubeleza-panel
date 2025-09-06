'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Wallet, 
  Plus, 
  ArrowUpRight,
  QrCode,
  Loader2
} from "lucide-react"
import { formatCurrency } from '@/lib/utils'
import type { Wallet as WalletType } from '@/types/entities/wallet'
import { CurrencyInput } from '@/components/ui/currency-input'
import { PixPaymentDialog} from './pix-dialog'
import { createWalletPaymentAction, type CreateWalletPaymentReturn } from '@/lib/api/actions/wallet'
import { toast } from 'sonner'

interface WalletCardProps {
  wallet: WalletType
}

export function WalletCard({ wallet }: WalletCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [isSubmitting, setIsSubmiting] = useState(false)
  const [pixPaymentData, setPixPaymentData] = useState<CreateWalletPaymentReturn | null>(null)

  const handleAddBalance = async () => {
    setIsSubmiting(true)

    const { success, result } = await createWalletPaymentAction(amount)

    if (!success) {
      toast.error("Ocorreu um erro inesperado, tente novamente mais tarde")
      setIsSubmiting(false)
      return
    }

    setPixPaymentData(result as CreateWalletPaymentReturn)
    setIsSubmiting(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className='w-full grid col-span-2' asChild>
          <Card className="w-full h-full border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-md transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wallet className="h-5 w-5 text-purple-600" />
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                {formatCurrency(wallet.balance)}
              </CardTitle>
              <CardDescription className="text-slate-600">
                Saldo disponível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <ArrowUpRight className="h-4 w-4" />
                <span>Última movimentação há 2h</span>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-blue-600" />
              </div>
              Carteira Digital
            </DialogTitle>
            <DialogDescription>
              Gerencie seu saldo e veja o histórico de transações
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Saldo Atual */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-sm text-slate-600 mb-1">Saldo disponível</div>
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(wallet.balance)}
              </div>
            </div>

            {/* Adicionar Saldo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <QrCode size={16} />
                <Label className="text-base font-semibold">Adicionar Saldo com PIX</Label>
              </div>
              
              <div className="grid gap-3">
                <div className='w-full h-fit flex flex-col gap-3'>
                  <Label htmlFor="amount">Qual o valor?</Label>
                  <CurrencyInput
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e)}
                    className="text-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
            <Button 
              onClick={handleAddBalance}
              className="bg-primary hover:bg-primary-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className='h-4 w-4 mr-1 animate-spin' />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              Adicionar {amount ? formatCurrency(Number(amount)) : 'Saldo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {pixPaymentData && (
        <PixPaymentDialog 
          {...pixPaymentData}
          onSuccess={() => {
            setPixPaymentData(null)
            setAmount(0)
            setIsOpen(false)
          }}
        />
      )}
    </>
  )
}