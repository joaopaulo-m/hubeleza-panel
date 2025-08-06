'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Edit, Pencil } from "lucide-react"

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
import type { Partner } from "@/types/entities/partner"
import { getTreatmentsAction } from "@/lib/api/actions/treatment"
import { updatePartnerAction } from "@/lib/api/actions/partner"
import { MaskedInput } from "@/components/ui/masked-input"
import { TreatmentSelector } from "../../_components/treatment-selector"

const formSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  cep: z.string().min(1, "Campo obrigatório"),
  phone_number: z.string().min(1, "Campo obrigatório"),
  treatment_ids: z.array(z.string()).min(1, "Selecione pelo menos um tratamento")
})

type Props = {
  partner: Partner
}

export const UpdatePartnerForm = ({ partner }: Props) => {
  const [open, setOpen] = useState(false)
  const [treatments, setTreatments] = useState<Treatment[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: partner.name,
      cep: formatCep(partner.cep),
      phone_number: formatPhone(partner.phone_number),
      treatment_ids: partner.treatments.map(t => t.id)
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

  function formatPhone(phone: string) {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  function formatCep(cep: string) {
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
  }

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      const payload = {
        partner_id: partner.id,
        name: data.name,
        cep: unmask(data.cep),
        phone_number: unmask(data.phone_number),
        treatment_ids: data.treatment_ids
      }

      await updatePartnerAction(payload)

      toast.success("Partner atualizado com sucesso")
      setOpen(false)
    } catch (error) {
      console.error("Erro ao atualizar partner:", error)
      toast.error("Erro ao atualizar partner, tente novamente.")
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
              <DialogTitle className="mb-5">Editar parceiro</DialogTitle>
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
                      <TreatmentSelector 
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
