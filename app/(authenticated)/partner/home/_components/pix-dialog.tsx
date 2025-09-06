'use client'

import { useEffect, useState } from "react"
import { Copy, Check, QrCode, Clock, AlertCircle, Smartphone, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Transaction } from "@/types/entities/transaction"
import { formatCurrency } from "@/lib/utils"
import { getTransactionByIdAction } from "@/lib/api/actions/transaction"
import { revalidateWallet } from "@/lib/api/actions/wallet"

export interface PixPaymentDialogProps {
  transaction_id: string
  qr_code: string
  pix_copy_paste_code: string
  onSuccess: () => void
}

export const PixPaymentDialog = (props: PixPaymentDialogProps) => {
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const [getTransactionDataCounter, setGetTransactionDataCounter]= useState(0)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [transactionPaid, setTransactionPaid] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.pix_copy_paste_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Erro ao copiar:", error)
    }
  }

  useEffect(() => {
    async function getTransaction() {
      const transaction = await getTransactionByIdAction(props.transaction_id)

      setTransaction(transaction)

      if (transaction.status === "PENDING_PAYMENT") {
        setTimeout(() => { setGetTransactionDataCounter(getTransactionDataCounter + 1) }, 2300)
      } else {
        await revalidateWallet()
        setTransactionPaid(true)
      }
    }

    getTransaction()
  }, [getTransactionDataCounter, props.transaction_id])

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (transactionPaid) {
        props.onSuccess()
      }
      setOpen(newOpen)
    }}>
      <DialogContent showCloseButton={transactionPaid ? true : false} className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {transactionPaid ? (
          <div className="space-y-8 text-center max-w-md mx-auto">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            
            {/* Floating particles effect - Multiple layers */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Layer 1 - Close particles */}
              <div className="w-3 h-3 bg-green-300 rounded-full animate-bounce absolute top-2 left-4 opacity-80 delay-100"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce absolute top-0 right-6 opacity-70 delay-300"></div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce absolute top-4 right-2 opacity-60 delay-500"></div>
              <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-bounce absolute bottom-2 left-2 opacity-75 delay-700"></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce absolute bottom-0 right-8 opacity-50 delay-900"></div>
              
              {/* Layer 2 - Medium distance particles */}
              <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce absolute -top-2 left-8 opacity-60 delay-200"></div>
              <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-bounce absolute -top-4 right-4 opacity-50 delay-400"></div>
              <div className="w-1 h-1 bg-green-300 rounded-full animate-bounce absolute top-6 -left-2 opacity-40 delay-600"></div>
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce absolute -bottom-2 right-2 opacity-65 delay-800"></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce absolute bottom-6 -right-2 opacity-55 delay-1000"></div>
              
              {/* Layer 3 - Far particles */}
              <div className="w-1 h-1 bg-green-100 rounded-full animate-bounce absolute -top-6 left-12 opacity-30 delay-150"></div>
              <div className="w-1.5 h-1.5 bg-emerald-100 rounded-full animate-bounce absolute -top-8 right-8 opacity-35 delay-350"></div>
              <div className="w-1 h-1 bg-green-200 rounded-full animate-bounce absolute top-8 -left-6 opacity-25 delay-550"></div>
              <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full animate-bounce absolute -bottom-6 right-10 opacity-40 delay-750"></div>
              <div className="w-1 h-1 bg-green-300 rounded-full animate-bounce absolute bottom-8 -right-4 opacity-30 delay-950"></div>
              
              {/* Layer 4 - Tiny sparkles */}
              <div className="w-0.5 h-0.5 bg-green-400 rounded-full animate-ping absolute top-1 left-16 opacity-60 delay-1100"></div>
              <div className="w-0.5 h-0.5 bg-emerald-400 rounded-full animate-ping absolute top-3 right-12 opacity-50 delay-1300"></div>
              <div className="w-0.5 h-0.5 bg-green-500 rounded-full animate-ping absolute bottom-1 left-20 opacity-40 delay-1500"></div>
              <div className="w-0.5 h-0.5 bg-emerald-500 rounded-full animate-ping absolute bottom-3 right-16 opacity-45 delay-1700"></div>
              
              {/* Pulsing rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-300 rounded-full animate-ping opacity-20 delay-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-emerald-200 rounded-full animate-ping opacity-15 delay-1000"></div>
            </div>
          </div>
    
          {/* Success Message */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">
              Pagamento Aprovado!
            </h2>
            <p className="text-gray-600 text-lg">
              Sua transação foi processada com sucesso
            </p>
          </div>
    
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700 uppercase tracking-wide">
                Valor Pago
              </p>
              <p className="text-4xl font-bold text-green-600">
                {transaction?.amount ? formatCurrency(transaction.amount) : formatCurrency(0)}
              </p>
            </div>
          </div>
    
          {/* Footer Note */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-green-800">
                  <strong>Tudo pronto!</strong> Você receberá um e-mail de confirmação em alguns instantes. 
                  Guarde o ID da transação para futuras consultas.
                </p>
              </div>
            </div>
          </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              <DialogHeader className="text-center pb-2">
                <div className="w-16 h-16 absolute top-5 right-5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-green-600" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Pagamento PIX
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-green-600">{transaction ? formatCurrency(transaction.amount) : formatCurrency(0)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Escaneie o QR code ou copie o código
                  </p>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* QR Code */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100">
                    <img 
                      src={`data:image/png;base64,${props.qr_code}`} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-4 py-2 rounded-full">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm font-medium">Abra seu app bancário e escaneie</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">ou</span>
                  </div>
                </div>

                {/* Código Copia e Cola */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Copy className="w-4 h-4" />
                    <span className="font-medium">Código PIX copia e cola</span>
                  </div>
                  <div className="relative">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4">
                      <p className="text-xs font-mono text-gray-600 break-all leading-relaxed">
                        {props.pix_copy_paste_code}
                      </p>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      className={`absolute top-2 right-2 h-8 w-20 text-xs transition-all duration-200 ${
                        copied 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {copied ? (
                        <div className="flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Copiado</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Instruções */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900">Como pagar:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Abra o app do seu banco</li>
                        <li>• Vá em PIX → Pagar → QR Code ou Copia e Cola</li>
                        <li>• Escaneie o código ou cole o texto</li>
                        <li>• Confirme o pagamento</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center space-x-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Este código expira em 15 minutos</span>
                </div>
              </div>
            </div>  
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}