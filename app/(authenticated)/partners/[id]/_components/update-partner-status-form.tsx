import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updatePartnerStatusAction } from "@/lib/api/actions/partner";
import type { Partner } from "@/types/entities/partner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface UpdatePartnerStatusFormProps {
  partner: Partner
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  status: z.string()
})

export function UpdatePartnerStatusForm(props: UpdatePartnerStatusFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: props.partner.status
    }
  })

  async function onSubmitHandle(data: z.infer<typeof formSchema>) {
    try {
      await updatePartnerStatusAction({
        partner_id: props.partner.id,
        status: data.status
      })

      toast.success("Status alterado com sucesso")
      props.onOpenChange(false)
    } catch {
      toast.error("Erro ao alterar status do parceiro", {
        description: "Tente novamente mais tarde"
      })

      props.onOpenChange(false)
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandle)}>
            <DialogHeader>
              <DialogTitle className="mb-5">Mudar status do parceiro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status:</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PAYMENT_PENDING">Aguardando pagamento</SelectItem>
                          <SelectItem value="CONFIRMATION_PENDING">Esperando confirmação</SelectItem>
                          <SelectItem value="ACTIVE">Ativo</SelectItem>
                          <SelectItem value="RECHARGE_REQUIRED">Recarga necessária</SelectItem>
                          <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                          <SelectItem value="CANCELED">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Alterar status</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}