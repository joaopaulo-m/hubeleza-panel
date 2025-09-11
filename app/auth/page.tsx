'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authenticateWithEmailAndPassword, getAccountType } from "@/lib/api/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AccountType } from "@/types/enums/account-type"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Por favor, digite um e-mail válido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(4, "A senha deve ter pelo menos 4 caracteres")
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onBlur"
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    
    const { success, account_type } = await authenticateWithEmailAndPassword({
      email: data.email,
      password: data.password
    })

    if (!success) {
      toast.error("Erro ao autenticar", {
        description: "Credenciais inválidas"
      })

      setIsLoading(false)
      return
    }

    toast.success("Autenticação feita com sucesso")
    setTimeout(() => {
      setIsLoading(false)

      if (account_type === AccountType.ADMIN || account_type === AccountType.OPERATOR) {
        router.push("/dashboard")
      } else if (account_type === AccountType.PARTNER) {
        router.push("/partner/home")
      } else {
        toast.error("Não foi possível encontrar o tipo da conta.")
      }
    }, 1200)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="max-h-screen overflow-hidden min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Seção esquerda - Hero/Brand */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-white">
          <div className="flex flex-col justify-center w-full px-12 xl:px-16">
            {/* Logo/Brand area */}
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center">
                <Image 
                  src="/logo.png"
                  alt="Logo"
                  width={220}
                  height={100}
                />
              </div>
              <Image 
                src="/funnel-illustration.png"
                width={300}
                height={300}
                alt="Logo"
                // className="mx-auto"
              />
              <h1 className="text-xl xl:text-2xl font-semibold text-gray-900 mb-6 leading-tight">
                Mais leads menos custo
              </h1>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-violet-50 to-transparent rounded-full translate-y-48 translate-x-48"></div>
        </div>

        {/* Seção direita - Formulário */}
        <div className="flex-1 flex flex-col justify-center bg-white lg:bg-gray-50">
          <div className="w-full max-w-md mx-auto px-6 sm:px-8">
            
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Hubeleza</h1>
            </div>

            {/* Card container */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Entrar na conta</h2>
                <p className="text-gray-600">Digite seus dados para continuar</p>
              </div>

              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 mb-2">
                          Endereço de e-mail
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              type="email"
                              placeholder="Digite seu e-mail"
                              className="pl-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50 focus:bg-white"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 mb-2">
                          Senha
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Digite sua senha"
                              className="pl-12 pr-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50 focus:bg-white"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-[#740499] hover:bg-purple-800 text-white font-medium text-base rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar na conta"
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-xs text-gray-500">
                Ao continuar, você concorda com nossos{" "}
                <button className="underline hover:text-gray-700 transition-colors">
                  Termos de Uso
                </button>{" "}
                e{" "}
                <button className="underline hover:text-gray-700 transition-colors">
                  Política de Privacidade
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}