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
import type { Operator } from "@/types/entities/operator"
import { updateOperatorAction } from "@/lib/api/actions/operator"

interface EditOperatorProps {
  operator: Operator
}

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  email: z.email('E-mail inválido'),
  sign_up_comission_percentage: z.string(),
  topup_comission_percentage: z.string()
})

export const EditOperatorForm = (props: EditOperatorProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.operator.name,
      email: props.operator.email,
      sign_up_comission_percentage: props.operator.sign_up_comission_percentage ? String(props.operator.sign_up_comission_percentage) : "",
      topup_comission_percentage: props.operator.topup_comission_percentage ? String(props.operator.topup_comission_percentage) : ""
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await updateOperatorAction({
        operator_id: props.operator.id,
        name: data.name,
        email: data.email,
        sign_up_comission_percentage: data.sign_up_comission_percentage ? Number(data.sign_up_comission_percentage) : undefined,
        topup_comission_percentage: data.topup_comission_percentage ? Number(data.topup_comission_percentage) : undefined
      })

      toast.success("Operador editado com sucesso")
      setOpen(false)
      form.resetField("name")
      form.resetField("email")
    } catch (error) {
      console.error("Error editing operator: ", error)
      toast.error("Erro ao editar operador, tente novamente mais tarde.")
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
              <DialogTitle className="mb-5">Editar Operador</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do operador:</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do operador" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input type='email' {...field} />
                    </FormControl>
                    <FormMessage />
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
              <Button type="submit">Editar operador</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}