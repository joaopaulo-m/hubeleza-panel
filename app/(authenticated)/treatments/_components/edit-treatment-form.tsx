'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Edit, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateTreatmentAction } from "@/lib/api/actions/treatment"
import type { Treatment } from "@/types/entities/treatment"

interface EditTreatmentFormProps {
  treatment: Treatment
}

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
})

export const EditTreatmentForm = (props: EditTreatmentFormProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.treatment.name,
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await updateTreatmentAction({
        treatment_id: props.treatment.id,
        name: data.name
      })

      toast.success("Tratamento alterado com sucesso")
      setOpen(false)
      form.resetField("name")
    } catch (error) {
      console.error("Error creating form: ", error)
      toast.error("Erro ao editar tratamento, tente novamente mais tarde.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
          <Edit className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Editar tratamento</DialogTitle>
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
              <Button type="submit">Editar tratamento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}