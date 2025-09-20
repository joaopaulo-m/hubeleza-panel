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
import { createWalletPaymentAction, type CreateWalletPaymentReturn } from '@/lib/api/actions/wallet'
import { toast } from 'sonner'
import type { OperatorWallet } from '@/types/entities/operator-wallet'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PixAddressKeyType } from '@/types/enums/pix-address-key-type'
import { CurrencyInput } from '@/components/ui/currency-input'
import { MaskedInput } from '@/components/ui/masked-input'

interface OperatorWalletProps {
  wallet: OperatorWallet
}

const formSchema = z.object({
  pix_address_key: z.string().min(1, "Campo obrigatório"),
  pix_address_key_type: z.string().min(1, "Campo obrigatório"),
  amount: z.number()
})

export function OperatorWalletCard({ wallet }: OperatorWalletProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmiting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pix_address_key: "",
      pix_address_key_type: PixAddressKeyType.PHONE,
      amount: 0
    }
  })

  const handleAddBalance = async () => {
    setIsSubmiting(true)



    if (true) {
      toast.error("Ocorreu um erro inesperado, tente novamente mais tarde")
      setIsSubmiting(false)
      return
    }

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
                  Transferir
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
                <span>Transfira para sua conta</span>
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
          <Form {...form}>
            <form>
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
                    <Label className="text-base font-semibold">Retirar saldo</Label>
                  </div>
                  
                  <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="pix_address_key_type"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo da chave PIX:</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um tipo (Ex.: Celular, CPF, E-mail)" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={PixAddressKeyType.PHONE}>Celular</SelectItem>
                                <SelectItem value={PixAddressKeyType.CPF}>CPF</SelectItem>
                                <SelectItem value={PixAddressKeyType.EMAIL}>E-mail</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  {form.watch('pix_address_key_type') === PixAddressKeyType.CPF && (
                    <FormField
                      control={form.control}
                      name="pix_address_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sua chave PIX:</FormLabel>
                          <FormControl>
                            <MaskedInput 
                              value={field.value}
                              onChange={field.onChange}
                              mask='999.999.999-99'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {form.watch('pix_address_key_type') === PixAddressKeyType.PHONE && (
                    <FormField
                      control={form.control}
                      name="pix_address_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sua chave PIX:</FormLabel>
                          <FormControl>
                            <MaskedInput 
                              value={field.value}
                              onChange={field.onChange}
                              mask='(99) 9 9999-9999'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {form.watch('pix_address_key_type') === PixAddressKeyType.EMAIL && (
                    <FormField
                      control={form.control}
                      name="pix_address_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sua chave PIX:</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='seu@email.com' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor da transferência:</FormLabel>
                        <FormControl>
                          <CurrencyInput value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
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
                  Transferir {form.watch('amount') ? formatCurrency(Number(form.watch('amount'))) : 'Saldo'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}