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
import { createOperatorAction } from "@/lib/api/actions/operator"

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  email: z.email("E-mail inválido"),
})

export const CreateOperatorForm = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await createOperatorAction({
        name: data.name,
        email: data.email
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