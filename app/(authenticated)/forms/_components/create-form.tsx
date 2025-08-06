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
import { createFormAction } from "@/lib/api/actions/form"
import { TreatmentSelector } from "../../_components/treatment-selector"

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  external_form_id: z.string().min(2, "Campo obrigatório"),
  treatment_ids: z.array(z.string())
})

export const CreateForm = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      external_form_id: "",
      treatment_ids: []
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await createFormAction({
        ...data
      })

      toast.success("Formulário criado com sucesso")
      setOpen(false)
      form.resetField("name")
      form.resetField("external_form_id")
      form.resetField("treatment_ids")
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
          <span>Novo Formulário</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Criar novo formulário</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do formulário:</FormLabel>
                    <FormControl>
                      <Input placeholder="Formulário de botox" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="external_form_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificador de formulário:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="treatment_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tratamentos</FormLabel>
                    <FormControl>
                      <TreatmentSelector 
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Criar formulário</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}