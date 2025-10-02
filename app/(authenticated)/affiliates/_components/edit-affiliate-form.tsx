'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Affiliate } from "@/types/entities/affiliate"
import { updateAffiliateAction } from "@/lib/api/actions/affiliate"
import { CurrencyInput } from "@/components/ui/currency-input"

interface EditAffiliateFormProps {
  affiliate: Affiliate
}

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  referral_code: z.string().min(2, "Campo obrigatório"),
  comission_percentage: z.string().min(1, "Campo obrigatório"),
  lead_comission_amount: z.number()
})

export const EditAffiliateForm = (props: EditAffiliateFormProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.affiliate.name,
      referral_code: props.affiliate.referral_code,
      comission_percentage: props.affiliate.comission_percentage.toString(),
      lead_comission_amount: props.affiliate.lead_comission_amount || 0
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await updateAffiliateAction({
        affiliate_id: props.affiliate.id,
        name: data.name,
        referral_code: data.referral_code,
        comission_percentage: Number(data.comission_percentage),
        lead_comission_amount: data.lead_comission_amount
      })

      toast.success("Afiliado editado com sucesso")
      setOpen(false)
    } catch (error) {
      console.error("Error editing affiliate: ", error)
      toast.error("Erro ao editar afiliado, tente novamente mais tarde.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-gray-600 hover:text-gray-900">
          <Edit className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Editar afiliado</DialogTitle>
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
                    <FormMessage />
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
                    <FormMessage />
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
              <Button type="submit">Editar afiliado</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}