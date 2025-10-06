'use client'

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, IdCardIcon, Instagram, Tag } from "lucide-react"
import ReactPlayer from 'react-player'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MaskedInput } from "@/components/ui/masked-input"
import { checkReferralCodeAvailabilityAction, signAffiliateUpAction } from "@/lib/api/actions/affiliate";
import { generateAffiliateCodeFromName } from "@/lib/utils";
import { useRouter } from "next/navigation";

const signupSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    cpf: z.string(),
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
    phone_number: z.string().min(1, "Telefone é obrigatório"),
    referral_code: z.string().min(4, "Mínimo 4 caracteres").max(35, "Máximo 15 caracteres"),
    ig_username: z.string().min(1, "Campo obrigatório")
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não coincidem",
    path: ["confirm_password"],
  });

type SignupFormValues = z.infer<typeof signupSchema>

export function AffiliateSignupPageContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isReferralAvailable, setIsReferralAvailable] = useState<boolean | null>(null);

  const router = useRouter()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      password: "",
      confirm_password: "",
      referral_code: "",
      phone_number: "",
      ig_username: ""
    },
    mode: "onBlur"
  })

  function unmask(value: string) {
    return value.replace(/\D/g, '')
  }

  async function onSubmit(data: SignupFormValues) {
    if (!acceptTerms) {
      toast.error("Você deve aceitar os termos de uso para continuar")
      return
    }

    if (!isReferralAvailable) {
      toast.error("Código de afiliado não disponível!")
      return;
    }

    setIsLoading(true)
    
    try {
      const payload = {
        name: data.name,
        document: unmask(data.cpf),
        email: data.email,
        password: data.password,
        phone_number: unmask(data.phone_number),
        referral_code: data.referral_code,
        ig_username: data.ig_username
      }

      const { success } = await signAffiliateUpAction(payload)
      
      if (success) {
        toast.success('Conta criado com sucesso')
        router.push("/affiliate/home")
      }
    } catch (error) {
      console.error("Erro no cadastro de afiliado: ", error)
      toast.error("Erro inesperado, tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    const code = form.watch("referral_code")?.trim();

    if (!code || code.length < 4) {
      setIsReferralAvailable(null);
      return;
    }

    setIsCheckingAvailability(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-referral?code=${code}`);
        const data = await res.json();
        setIsReferralAvailable(data.available);
      } catch (err) {
        console.error("Erro ao verificar código:", err);
        setIsReferralAvailable(null);
      } finally {
        setIsCheckingAvailability(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [form.watch("referral_code")]);

  useEffect(() => {
    async function generateAffiliateCode() {
      const affiliateCode = await generateAffiliateCodeFromName(form.watch('name'), checkReferralCodeAvailabilityAction)

      form.setValue('referral_code', affiliateCode)
    }

    if (form.watch('name').length > 0) {
      generateAffiliateCode()
    }
  }, [form.watch("name")])

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
          <h1 className="text-2xl font-bold text-gray-900">Torne-se nosso afiliado</h1>
          <p className="text-base text-gray-600">Faça parte do nosso programa de afiliados e aumente seus ganhos com parcerias estratégicas</p>
        </div>

        <div className="w-full relative flex justify-center items-center rounded-xl overflow-hidden mb-12 mt-5">
          <ReactPlayer 
            style={{
              width: '100%',
              height: 400,
            }}
            src='https://www.youtube.com/watch?v=LXb3EKWsInQ' 
          />
        </div>

        {/* Card container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
          {/* Form */}
          <Form {...form}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
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
              <FormField
                control={form.control}
                name="referral_code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Seu código de afiliado
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          className="pl-12 h-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    {form.watch("referral_code")?.length >= 4 && (
                      <div className="text-sm mt-1 ml-1">
                        {isCheckingAvailability && (
                          <span className="text-gray-500">Verificando disponibilidade...</span>
                        )}
                        {isReferralAvailable === true && !isCheckingAvailability && (
                          <span className="text-green-600">Código disponível ✅</span>
                        )}
                        {isReferralAvailable === false && !isCheckingAvailability && (
                          <span className="text-red-600">Código já em uso ❌</span>
                        )}
                      </div>
                    )}
                    <FormMessage className="text-sm mt-1" />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="ig_username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Usuário do Instagram
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Instagram className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input 
                          {...field} 
                          placeholder="@seuinstagram"
                          className="pl-12 h-12"
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
                  </button>, e está ciente das condições e valores relacionados ao envio de leads, conforme descrito nos Termos.
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
                  "Criar minha conta!"
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
    </div>
  )
}