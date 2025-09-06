'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Check, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { definePasswordAction, getMe } from "@/lib/api/actions/auth"

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial")
})

const PasswordRequirement = ({ met, text }: { met: boolean, text: string }) => (
  <div className={`flex items-center space-x-2 text-sm transition-colors ${met ? 'text-green-600' : 'text-gray-500'}`}>
    {met ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
    <span>{text}</span>
  </div>
)

export const DefinePasswordForm = () => {
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: ""
    }
  })

  const watchPassword = form.watch("password")

  const passwordRequirements = [
    { met: watchPassword.length >= 8, text: "Pelo menos 8 caracteres" },
    { met: /[A-Z]/.test(watchPassword), text: "Uma letra maiúscula" },
    { met: /[a-z]/.test(watchPassword), text: "Uma letra minúscula" },
    { met: /[0-9]/.test(watchPassword), text: "Um número" },
    { met: /[^A-Za-z0-9]/.test(watchPassword), text: "Um caractere especial" }
  ]

  const allRequirementsMet = passwordRequirements.every(req => req.met)

  async function onSubmitHandle(data: z.infer<typeof passwordSchema>) {
    setIsSubmitting(true)

    const { success } = await definePasswordAction(data.password)

    if (success) {
      setOpen(false)
      form.reset()
      setPassword("")
      
      toast.success("Senha definida com sucesso!")
    } else {
      toast.error("Erro ao definir sua senha, tente novamente mais tarde.")
    }

    setIsSubmitting(false)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    form.setValue("password", value)
  }

  useEffect(() => {
    async function getAccount() {
      const account = await getMe()

      if (account.password_not_defined) {
        setOpen(true)
      }
    }

    getAccount()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        showCloseButton={false} 
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
        }}
        className="sm:max-w-md"
      >
        <Form {...form}>
          <div className="space-y-6">
            <DialogHeader className="text-center pb-2">
              <div className="absolute right-5 top-5 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Defina sua senha
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Crie uma senha segura para proteger sua conta
              </p>
            </DialogHeader>
            
            <div className="space-y-4">
              <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nova senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua nova senha"
                          className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          {...field}
                          value={password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Strength Indicator */}
              {watchPassword && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Força da senha:
                    </span>
                    <span className={`text-sm font-medium ${
                      allRequirementsMet ? 'text-green-600' : 
                      passwordRequirements.filter(req => req.met).length >= 3 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {allRequirementsMet ? 'Forte' : 
                       passwordRequirements.filter(req => req.met).length >= 3 ? 'Média' : 
                       'Fraca'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        allRequirementsMet ? 'bg-green-500 w-full' : 
                        passwordRequirements.filter(req => req.met).length >= 3 ? 'bg-yellow-500 w-3/4' : 
                        'bg-red-500 w-1/4'
                      }`}
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Requisitos da senha:</p>
                    {passwordRequirements.map((requirement, index) => (
                      <PasswordRequirement
                        key={index}
                        met={requirement.met}
                        text={requirement.text}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button 
                onClick={form.handleSubmit(onSubmitHandle)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                disabled={!allRequirementsMet || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Definindo...</span>
                  </div>
                ) : (
                  "Definir senha"
                )}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}