import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, QrCode, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface WalletPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pixCode: string
  amount: number
  partnerName: string
}

export const WalletPaymentDialog = (props: WalletPaymentDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(props.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar PIX:', err);
    }
  };

  const formatPixCode = (code: string) => {
    const chunks = code.match(/.{1,40}/g) || [];
    return chunks.join('\n');
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="text-center pb-4">
          <div className="absolute top-5 right-5 mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <QrCode className="w-5 h-5 text-gray-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Pagamento PIX Criado
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Envie este código PIX para <strong>{props.partnerName}</strong> adicionar saldo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Valor */}
          <div className="text-center py-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Valor
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(props.amount)}
            </div>
          </div>

          {/* PIX Code */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">
              Código PIX Copia e Cola
            </label>
            
            <div className="relative">
              <div className="bg-gray-50 border rounded-lg p-3 min-h-[120px] max-h-32 overflow-y-auto">
                <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap break-all leading-relaxed">
                  {formatPixCode(props.pixCode)}
                </pre>
              </div>
              
              <Button
                onClick={handleCopyPixCode}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            {copied && (
              <div className="flex items-center gap-2 text-sm text-green-600 animate-in fade-in duration-200">
                <Check className="w-4 h-4" />
                <span>Código copiado com sucesso!</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => props.onOpenChange(false)}
            className="flex-1"
          >
            Fechar
          </Button>
          <Button 
            onClick={handleCopyPixCode}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar PIX
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};