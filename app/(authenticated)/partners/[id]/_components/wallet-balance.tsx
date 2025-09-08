"use client"

import React, { useEffect, useState } from "react"
import { Wallet as WalletIcon, Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { formatCurrency } from "@/lib/utils"
import type { Wallet } from "@/types/entities/wallet"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { createWalletCreditPaymentAction, creditWalletAction } from "@/lib/api/actions/wallet"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletPaymentDialog } from "./wallet-payment-dialog"
import { AccountType } from "@/types/enums/account-type"
import { getAccountType } from "@/lib/api/actions/auth"

interface WalletBalanceProps {
  wallet: Wallet
  partnerName: string
}

const formSchema = z.object({
  amount: z.number()
})

export function WalletBalance({ wallet, partnerName }: WalletBalanceProps) {
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [isWalletPaymentOpen, setIsWalletPaymentOpen] = useState(false)
  const [paymentData, setPaymentData] = useState<{ pixCode: string, amount: number } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    }
  })

  // Calcular estatísticas das transações
  const stats = React.useMemo(() => {
    const transactions = wallet.transactions || []
    const credits = transactions.filter(t => t.type === 'INCOME')
    const debits = transactions.filter(t => t.type === 'EXPENSE')
    
    return {
      totalCredits: credits.reduce((sum, t) => sum + (t.amount + (t.bonus_amount || 0)), 0),
      totalDebits: debits.reduce((sum, t) => sum + t.amount, 0),
      totalTransactions: transactions.length,
      lastTransaction: transactions.length > 0 
        ? transactions.sort((a, b) => b.created_at - a.created_at)[0]
        : null
    }
  }, [wallet.transactions])

  const balanceColor = wallet.balance > 0 
    ? "text-green-600" 
    : wallet.balance === 0 
      ? "text-gray-600" 
      : "text-red-600"

  async function onCreateWalletPaymentClick(data: z.infer<typeof formSchema>) {
    const result = await createWalletCreditPaymentAction({
      wallet_id: wallet.id,
      amount: data.amount
    })

    if (result.success) {
      toast.success("Transação criada com sucesso!")

      setPaymentData({
        pixCode: result.result?.pix_copy_paste_code || "",
        amount: data.amount
      })
      setIsWalletPaymentOpen(true)
      form.setValue('amount', 0)
    } else {
      toast.error("Erro ao criar transação", {
        description: "Tente novamente mais tarde."
      })
    }
  }

  async function onCreditWalletClick(data: z.infer<typeof formSchema>) {
    try {
      await creditWalletAction({
        wallet_id: wallet.id,
        amount: data.amount
      })

      toast.success("Saldo adicionado com sucesso!")
      form.setValue('amount', 0)
    } catch {
      toast.error("Erro ao adicionar saldo", {
        description: "Tente novamente mais tarde."
      })
    }
  }

  useEffect(() => {
    async function getCurrentAccountType() {
      const accountType = await getAccountType()

      setAccountType(accountType)
    }

    getCurrentAccountType()
  }, [])

  useEffect(() => console.log("account type: ", accountType), [accountType])

  return (
    <div className="space-y-4">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WalletIcon className="w-5 h-5 text-gray-600" />
                Saldo Atual
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Recarregar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Tabs defaultValue="payment" className="w-full">
                    <TabsList className="w-full mb-5">
                      <TabsTrigger value="payment">Gerar pagamento</TabsTrigger>
                      <TabsTrigger value="bonus" disabled={accountType !== AccountType.ADMIN}>Adicionar bônus</TabsTrigger>
                    </TabsList>
                    <TabsContent value="payment">
                      <DialogHeader className="mb-4">
                        <DialogTitle>Gerar pagamento de recarga</DialogTitle>
                        <DialogDescription>
                          Crie um código PIX copia e cola para recarga de saldo do parceiro
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onCreateWalletPaymentClick)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor</FormLabel>
                                <FormControl>
                                  <CurrencyInput {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => form.setValue("amount", 10000)}
                            >
                              R$ 100
                            </Button>
                            <Button
                              variant="outline"
                              type="button"
                              size="sm"
                              onClick={() => form.setValue("amount", 25000)}
                            >
                              R$ 250
                            </Button>
                            <Button
                              variant="outline"
                              type="button"
                              size="sm"
                              onClick={() => form.setValue("amount", 50000)}
                            >
                              R$ 500
                            </Button>
                          </div>
                          <Button 
                            className="w-full"
                            type="submit"
                          >
                            {form.formState.isSubmitting ? "Processando..." : `Recarregar ${formatCurrency(form.watch("amount"))}`}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                    <TabsContent value="bonus">
                      <DialogHeader className="mb-4">
                        <DialogTitle>Adicionar saldo bônus</DialogTitle>
                        <DialogDescription>
                          Acrescente créditos na carteira do parceiro
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onCreditWalletClick)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor</FormLabel>
                                <FormControl>
                                  <CurrencyInput {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => form.setValue("amount", 10000)}
                            >
                              R$ 100
                            </Button>
                            <Button
                              variant="outline"
                              type="button"
                              size="sm"
                              onClick={() => form.setValue("amount", 25000)}
                            >
                              R$ 250
                            </Button>
                            <Button
                              variant="outline"
                              type="button"
                              size="sm"
                              onClick={() => form.setValue("amount", 50000)}
                            >
                              R$ 500
                            </Button>
                          </div>
                          <Button 
                            className="w-full"
                            type="submit"
                          >
                            {form.formState.isSubmitting ? "Processando..." : `Recarregar ${formatCurrency(form.watch("amount"))}`}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className={`text-4xl font-bold ${balanceColor}`}>
                  {formatCurrency(wallet.balance)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Saldo disponível para compra de leads
                </p>
              </div>
              
              {wallet.balance <= 75 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700 font-medium">
                    ⚠️ Saldo baixo
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Recomendamos recarregar para continuar recebendo leads
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo de Transações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">Créditos</span>
              </div>
              <span className="font-medium text-green-600">
                {formatCurrency(stats.totalCredits)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600">Débitos</span>
              </div>
              <span className="font-medium text-red-600">
                -{formatCurrency(stats.totalDebits)}
              </span>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total de transações</span>
                <Badge variant="outline">{stats.totalTransactions}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Transaction */}
      {stats.lastTransaction && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Última Transação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stats.lastTransaction.type === 'INCOME' 
                    ? 'bg-green-50' 
                    : 'bg-red-50'
                }`}>
                  {stats.lastTransaction.type === 'INCOME' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {stats.lastTransaction.type === 'INCOME' ? 'Recarga' : 'Compra de Lead'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(stats.lastTransaction.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  stats.lastTransaction.type === 'INCOME' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {stats.lastTransaction.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(stats.lastTransaction.amount + (stats.lastTransaction?.bonus_amount || 0))}
                </p>
                <Badge variant="outline" className="mt-1">
                  {stats.lastTransaction.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {paymentData && (
        <WalletPaymentDialog 
          open={isWalletPaymentOpen}
          onOpenChange={setIsWalletPaymentOpen}
          partnerName={partnerName}
          pixCode={paymentData.pixCode}
          amount={paymentData.amount}
        />
      )}
    </div>
  )
}