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
import { createTreatmentAction } from "@/lib/api/actions/treatment"

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
})

export const CreateTreatmentForm = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await createTreatmentAction({
        ...data
      })

      toast.success("Tratamento criado com sucesso")
      setOpen(false)
      form.resetField("name")
    } catch (error) {
      console.error("Error creating form: ", error)
      toast.error("Erro ao criar formulário, tente novamente mais tarde.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Novo Tratamento</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Criar novo tratamento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do tratamento:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Fios de PDO" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Criar tratamento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}