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
import { createInviteToken } from "@/lib/api/actions/invite-token"
import { MaskedInput } from "@/components/ui/masked-input"

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  phone_number: z.string().min(1, "Campo obrigatório")
})

export const CreateInviteForm = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone_number: ""
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await createInviteToken({
        name: data.name,
        phone_number: data.phone_number
      })

      toast.success("Convite criado com sucesso")
      setOpen(false)
      form.resetField("name")
    } catch (error) {
      console.error("Error creating invite: ", error)
      toast.error("Erro ao criar convite, tente novamente mais tarde.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="px-4 py-2 rounded-lg flex items-center space-x-1 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Novo convite</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Criar novo convite</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dê um nome para o convite:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do parceiro:</FormLabel>
                    <FormControl>
                      <MaskedInput mask="(99) 9 9999-9999" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Criar convite</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}