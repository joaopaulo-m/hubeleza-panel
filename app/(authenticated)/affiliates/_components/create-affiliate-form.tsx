'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MaskedInput } from "@/components/ui/masked-input"
import { createAffiliateAction } from "@/lib/api/actions/affiliate"
import { CurrencyInput } from "@/components/ui/currency-input"

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  email: z.email("E-mail incorreto"),
  document: z.string().min(2, "Campo obrigatório"),
  referral_code: z.string().min(2, "Campo obrigatório"),
  comission_percentage: z.string(),
  lead_comission_amount: z.number(),
})

export const CreateAffiliateForm = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      document: "",
      referral_code: "",
      comission_percentage: "",
      lead_comission_amount: 0
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await createAffiliateAction({
        name: data.name,
        email: data.email,
        document: data.document,
        referral_code: data.referral_code,
        comission_percentage: Number(data.comission_percentage),
        lead_comission_amount: data.lead_comission_amount
      })

      toast.success("Afiliado criado com sucesso")
      setOpen(false)
    } catch (error) {
      console.error("Error creating affiliate: ", error)
      toast.error("Erro ao criar afiliado, tente novamente mais tarde.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="px-4 py-2 rounded-lg flex items-center space-x-1 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Novo afiliado</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Criar novo afiliado</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do afiliado:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail do afiliado:</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="referral_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do afiliado:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF do afiliado:</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="999.999.999-99"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full h-fit flex items-center gap-6">
                <FormField 
                  control={form.control}
                  name="lead_comission_amount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Comissão por Lead:</FormLabel>
                      <FormControl>
                        <CurrencyInput {...field} /> 
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="comission_percentage"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Comissão cadastro:</FormLabel>
                      <FormControl>
                        <div className="w-full relative flex items-center">
                          <Input type="number" {...field} />
                          <span className="absolute right-3 text-sm p-1 rounded-lg bg-white">%</span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Criar afiliado</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}