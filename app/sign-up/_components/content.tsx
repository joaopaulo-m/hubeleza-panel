'use client'

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Loader2, IdCardIcon, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MaskedInput } from "@/components/ui/masked-input"
import { TreatmentSelector } from "../../(authenticated)/_components/treatment-selector"
import { signPartnerUpAction, type SignPartnerUpReturn } from "@/lib/api/actions/partner"
import { toast } from "sonner"
import axios from "axios"
import { getInviteTokenByTokenAction } from "@/lib/api/actions/invite-token"
import { AccountPaymentDialog } from "./account-payment-dialog"
import { authenticateWithEmailAndPassword } from "@/lib/api/actions/auth";

const signupSchema = z
  .object({
    company_name: z.string().min(1, "O nome da empresa é obrigatório"),
    name: z.string().min(1, "Nome é obrigatório"),
    cpf: z.string(),
    cnpj: z.string().optional(),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("Formato de e-mail inválido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirm_password: z
      .string()
      .min(1, "Confirmação de senha é obrigatória"),
    cep: z.string().min(1, "CEP é obrigatório"),
    city: z.string(),
    state: z.string(),
    phone_number: z.string().min(1, "Telefone é obrigatório"),
    treatment_ids: z.array(z.string()).min(1, "Selecione pelo menos um tratamento"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não coincidem",
    path: ["confirm_password"],
  });

type SignupFormValues = z.infer<typeof signupSchema>

export function PartnerSignupPageContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [cep, setCep] = useState('')
  const [paymentData, setPaymentData] = useState<SignPartnerUpReturn | null>(null)

  const searchParams = useSearchParams();
  const router = useRouter()
  
  const token = searchParams.get("token");
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      company_name: "",
      name: "",
      cpf: "",
      cnpj: "",
      email: "",
      password: "",
      confirm_password: "",
      cep: "",
      city: "",
      state: "",
      phone_number: "",
      treatment_ids: []
    },
    mode: "onBlur"
  })

  function unmask(value: string) {
    return value.replace(/\D/g, '')
  }

  async function onSubmit(data: SignupFormValues) {
    if (!acceptTerms) {
      alert("Você deve aceitar os termos de uso para continuar")
      return
    }

    setIsLoading(true)
    
    try {
      const payload = {
        invite_token: token || "",
        name: data.name,
        company_name: data.company_name,
        cpf: unmask(data.cpf),
        cnpj: data.cnpj ? unmask(data.cnpj) : undefined,
        email: data.email,
        password: data.password,
        cep: unmask(data.cep),
        city: data.city,
        state: data.state,
        phone_number: unmask(data.phone_number),
        treatment_ids: data.treatment_ids
      }

      toast.success(`Primeira etapa concluída!`)
      const paymentData = await signPartnerUpAction(payload)
      setPaymentData(paymentData)
    } catch (error) {
      console.error("Erro no cadastro:", error)
      toast.error("Erro ao criar parceiro", {
        description: "Convite expirado"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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

  async function onPaymentSuccess() {
    await new Promise(async res => setTimeout(res, 1200))
    await authenticateWithEmailAndPassword({
      email: form.watch('email'),
      password: form.watch('password')
    })

    router.push("/partner/home")
  }

  useEffect(() => {
      if (cep.length === 9) {
        setCityAndState(unmask(cep))
      }
    }, [form, cep])

  useEffect(() => {
    async function getInviteToken() {
      try {
        if (token) {
          const inviteToken = await getInviteTokenByTokenAction(token)

          form.setValue('phone_number', inviteToken.phone_number)
        }
      } catch(error) {
        console.error("Error getting invite token", error)
      }
    }

    getInviteToken()
  }, [token, form])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12">
      <div className="w-full max-w-[65vw] mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Image 
            src="/logo-variant.png"
            className="mb-6"
            alt="Logo"
            width={150}
            height={75}
          />
          <h1 className="text-2xl font-bold text-gray-900">Torne-se nosso parceiro</h1>
          <p className="text-base text-gray-600">Junte-se à nossa rede e expanda seu negócio</p>
        </div>

        {/* Card container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
          {/* Form */}
          <Form {...form}>
            <div className="space-y-6">
              
              {/* Nome Field */}
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Nome da Empresa
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          placeholder="Ex: Clínica Beauty"
                          className="pl-12 h-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm mt-1" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      E-mail da empresa
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="contato@clinica.com"
                          className="pl-12 h-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm mt-1" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* CEP Field */}
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        CEP
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <MaskedInput
                            mask="99999-999"
                            placeholder="00000-000"
                            className="pl-12 h-12"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm mt-1" />
                    </FormItem>
                  )}
                />

                {/* Telefone Field */}
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Telefone (WhatsApp)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <MaskedInput
                            mask="(99) 99999-9999"
                            placeholder="(00) 00000-0000"
                            className="pl-12 h-12"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Nome do responsável
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          placeholder="Ex: Seu nome"
                          className="pl-12 h-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm mt-1" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        CPF
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IdCardIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <MaskedInput
                            mask="999.999.999-99"
                            placeholder="000.000.000-00"
                            className="pl-12 h-12"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        CNPJ
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <MaskedInput
                            mask="99.999.999/9999-99"
                            placeholder="00.000.000/0000-00"
                            className="pl-12 h-12"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Crie uma senha segura"
                          className="pl-12 pr-12 h-12"
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

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Confirmar sua senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          className="pl-12 pr-12 h-12"
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

              {/* Tratamentos Field */}
              <FormField
                control={form.control}
                name="treatment_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Tratamentos oferecidos
                    </FormLabel>
                    <FormControl>
                      <TreatmentSelector
                        value={field.value}
                        onChange={field.onChange}
                        state={form.watch('state')}
                      />
                    </FormControl>
                    <FormMessage className="text-sm mt-1" />
                  </FormItem>
                )}
              />

              {/* Terms checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(e) => {
                    setAcceptTerms(Boolean(e))
                  }}
                  className="border-2 border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  Ao criar sua conta, você concorda com os{" "}
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-medium underline">
                    Termos de Uso
                  </button>{" "}
                  e{" "}
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-medium underline">
                    Política de Privacidade
                  </button>, e está ciente das condições e valores relacionados ao envio de leads para sua clínica, conforme descrito nos Termos.
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !acceptTerms}
                onClick={form.handleSubmit(onSubmit)}
                className="w-full h-14 bg-[#740499] hover:bg-purple-800 text-white font-semibold text-base rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Avançar para próxima etapa"
                )}
              </Button>
            </div>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Ao se cadastrar, você concorda com nossos termos de parceria e políticas de uso da plataforma.
          </p>
        </div>
      </div>
      {paymentData && (
        <AccountPaymentDialog 
          {...paymentData}
          onSuccess={onPaymentSuccess}
        />
      )}
    </div>
  )
}