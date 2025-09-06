'use client'

import { useEffect, useState } from "react"
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
import { CurrencyInput } from "@/components/ui/currency-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TreatmentStatePriceInput, type StatePriceData } from "./treatment-state-price-input"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  name: z.string().min(2, "Campo obrigatório"),
  price: z.number().min(0, "Campo obrigatório"),
  category: z.string().min(1, "Campo obrigatório"),
  state_prices: z.array(z.object({
    state: z.string(),
    price: z.number()
  }))
})

export const CreateTreatmentForm = () => {
  const [open, setOpen] = useState(false)
  const [statePrices, setStatePrices] = useState<StatePriceData[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      state_prices: []
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

  useEffect(() => {
    form.setValue("state_prices", statePrices)
  }, [form, statePrices])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button 
          className="px-4 py-2 rounded-lg flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo tratamento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[700px] min-h-[80vh] px-0">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandle)}>
              <ScrollArea className="w-full h-[70vh] px-6">
                <DialogHeader>
                  <DialogTitle className="mb-5">Criar novo tratamento</DialogTitle>
                </DialogHeader>
                <div className="grid gap-5">
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
                  <FormField 
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria do tratamento:</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="facial">Facial</SelectItem>
                              <SelectItem value="body">Corporal</SelectItem>
                              <SelectItem value="hair_removal">Depilação</SelectItem>
                              <SelectItem value="hair">Capilar</SelectItem>
                              <SelectItem value="wellness">Bem estar</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField 
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço do tratamento:</FormLabel>
                        <FormControl>
                          <CurrencyInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <TreatmentStatePriceInput 
                    basePrice={form.watch("price")}
                    statePrices={statePrices}
                    onStatePricesChange={setStatePrices}
                  />
                </div>
              </ScrollArea>
              <DialogFooter className="mt-5 px-6">
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