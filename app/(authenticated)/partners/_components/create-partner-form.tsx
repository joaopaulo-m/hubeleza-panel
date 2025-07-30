'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog, DialogClose, DialogContent,
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

import type { Treatment } from "@/types/entities/treatment"
import { getTreatmentsAction } from "@/lib/api/actions/treatment"
import { createPartnerAction } from "@/lib/api/actions/partner"
import { MaskedInput } from "@/components/ui/masked-input"

const formSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  cep: z.string().min(1, "Campo obrigatório"),
  phone_number: z.string().min(1, "Campo obrigatório"),
  treatment_ids: z.array(z.string()).min(1, "Selecione pelo menos um tratamento")
})

export const CreatePartnerForm = () => {
  const [open, setOpen] = useState(false)
  const [treatments, setTreatments] = useState<Treatment[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cep: "",
      phone_number: "",
      treatment_ids: []
    }
  })

  useEffect(() => {
    async function fetchTreatments() {
      const data = await getTreatmentsAction()
      setTreatments(data)
    }
    fetchTreatments()
  }, [])

  function unmask(value: string) {
    return value.replace(/\D/g, '')
  }

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      const payload = {
        name: data.name,
        cep: unmask(data.cep),
        phone_number: unmask(data.phone_number),
        treatment_ids: data.treatment_ids
      }

      await createPartnerAction(payload)

      toast.success("Parceiro criado com sucesso")
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error creating form:", error)
      toast.error("Erro ao criar parceiro, tente novamente.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Novo Parceiro</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Criar novo partner</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do parceiro</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Clínica beuty" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="99999-999"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="(99) 99999-9999"
                        value={field.value}
                        onChange={field.onChange}
                      />
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {field.value.length > 0
                              ? `${field.value.length} tratamento(s) selecionado(s)`
                              : "Selecione tratamentos"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] max-h-64 overflow-y-auto p-2">
                          <ScrollArea className="h-48">
                            {treatments.map((treatment) => (
                              <div key={treatment.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer">
                                <Checkbox
                                  id={treatment.id}
                                  checked={field.value.includes(treatment.id)}
                                  onCheckedChange={(checked) => {
                                    const selected = field.value
                                    if (checked) {
                                      form.setValue("treatment_ids", [...selected, treatment.id])
                                    } else {
                                      form.setValue("treatment_ids", selected.filter(id => id !== treatment.id))
                                    }
                                  }}
                                />
                                <label htmlFor={treatment.id} className="text-sm">{treatment.name}</label>
                              </div>
                            ))}
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Criar parceiro</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
