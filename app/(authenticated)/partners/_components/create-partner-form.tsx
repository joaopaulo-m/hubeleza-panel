'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import axios from "axios"

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
import { createPartnerAction } from "@/lib/api/actions/partner"
import { MaskedInput } from "@/components/ui/masked-input"
import { TreatmentSelector } from "../../_components/treatment-selector"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  company_name: z.string().min(1, "Campo obrigatório"),
  cpf: z.string().min(1, "Campo obrigatório"),
  email: z.email(),
  cep: z.string().min(1, "Campo obrigatório"),
  city: z.string(),
  state: z.string(),
  phone_number: z.string().min(1, "Campo obrigatório"),
  treatment_ids: z.array(z.string()).min(1, "Selecione pelo menos um tratamento")
})

export const CreatePartnerForm = () => {
  const [open, setOpen] = useState(false)
  const [cep, setCep] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company_name: "",
      cpf: "",
      email: "",
      cep: "",
      city: "",
      state: "",
      phone_number: "",
      treatment_ids: []
    }
  })

  async function setCityAndState(cep: string) {
    try {
      const { data: { localidade, uf } } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      
      form.setValue("city", localidade)
      form.setValue("state", uf)
    } catch (err) {
      toast.error("Erro ao buscar cidade e estado pelo CEP.")
      console.error(err)
    }
  }
  

  function unmask(value: string) {
    return value.replace(/\D/g, '')
  }

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      const payload = {
        name: data.name,
        company_name: data.company_name,
        cpf: data.cpf,
        email: data.email,
        cep: unmask(data.cep),
        city: data.city,
        state: data.state,
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
  
  useEffect(() => {
    if (cep.length === 9) {
      setCityAndState(unmask(cep))
    }
  }, [form, cep, setCityAndState])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="px-4 py-2 rounded-lg flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Parceiro</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px] max-h-[90vh] px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5 px-6">Criar novo parceiro</DialogTitle>
            </DialogHeader>
            <ScrollArea className="w-full h-[70vh] px-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do parceiro</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João da Silva" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Clínica beuty" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF do responsável</FormLabel>
                      <FormControl>
                      <MaskedInput
                          mask="999.999.999-99"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail do parceiro</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                          onChange={(e) => {
                            setCep(e)
                            field.onChange(e)
                          }}
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
            </ScrollArea>
            <DialogFooter className="mt-6 px-6">
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
