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
import { updateFormAction } from "@/lib/api/actions/form"
import type { Form as FormType } from "@/types/entities/form"
import { TreatmentSelector } from "../../_components/treatment-selector"

interface EditFormProps {
  form: FormType
}

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  external_form_id: z.string().min(2, "Campo obrigatório"),
  treatment_ids: z.array(z.string())
})

export const EditForm = (props: EditFormProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.form.name,
      external_form_id: props.form.external_form_id,
      treatment_ids: props.form.treatments.map(treatment => treatment.id)
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await updateFormAction({
        form_id: props.form.id,
        name: data.name,
        external_form_id: data.external_form_id !== props.form.external_form_id ? data.external_form_id : undefined,
        treatment_ids: data.treatment_ids
      })

      toast.success("Formulário editado com sucesso")
      setOpen(false)
      form.resetField("name")
      form.resetField("external_form_id")
    } catch (error) {
      console.error("Error editing form: ", error)
      toast.error("Erro ao editar formulário, tente novamente mais tarde.")
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
              <DialogTitle className="mb-5">Editar formulário</DialogTitle>
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
                    <FormMessage />
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
                    <FormMessage />
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
              <Button type="submit">Editar formulário</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}