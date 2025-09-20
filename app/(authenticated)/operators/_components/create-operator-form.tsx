'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createOperatorAction } from "@/lib/api/actions/operator"
import { MaskedInput } from "@/components/ui/masked-input"

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  email: z.email("E-mail inválido"),
  document: z.string().min(2, "Campo obrigatório"),
  sign_up_comission_percentage: z.string(),
  topup_comission_percentage: z.string()
})

export const CreateOperatorForm = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      document: "",
      sign_up_comission_percentage: "",
      topup_comission_percentage: ""
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await createOperatorAction({
        name: data.name,
        email: data.email,
        document: data.document,
        sign_up_comission_percentage: Number(data.sign_up_comission_percentage),
        topup_comission_percentage: Number(data.topup_comission_percentage)
      })

      toast.success("Operador criado com sucesso")
      setOpen(false)
      form.resetField("name")
      form.resetField("email")
    } catch (error) {
      console.error("Error creating operator: ", error)
      toast.error("Erro ao criar operador, tente novamente mais tarde.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="px-4 py-2 rounded-lg flex items-center space-x-1 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Novo Operador</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[55vw]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Criar novo Operador</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do operador:</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome aqui" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail do operador:</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        CPF
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MaskedInput
                            mask="999.999.999-99"
                            placeholder="000.000.000-00"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm mt-1" />
                    </FormItem>
                  )}
                />
                <div className="w-full h-fit flex items-center gap-5">
                  <FormField 
                    control={form.control}
                    name="sign_up_comission_percentage"
                    render={({ field }) => (
                      <FormItem className="w-full ">
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
                  <FormField 
                    control={form.control}
                    name="topup_comission_percentage"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Comissão recarga:</FormLabel>
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
              <Button type="submit">Criar operador</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}