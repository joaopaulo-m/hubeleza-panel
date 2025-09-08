'use client'

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Phone, User, MessageCircle } from 'lucide-react';
import { getAccountType, getMe } from '@/lib/api/actions/auth';
import type { Partner } from '@/types/entities/partner';
import { AccountType } from '@/types/enums/account-type';
import { PartnerStatus } from '@/types/enums/partner-status';

export const ApprovalPendingDialog = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function getAccount() {
      const accountType = await getAccountType()
      if (!accountType) return
      if (accountType !== AccountType.PARTNER) return

      const account = await getMe()

      if ((account as Partner).status === PartnerStatus.CONFIRMATION_PENDING) {
        setOpen(true)
      }

      if ((account as Partner).status === PartnerStatus.PAYMENT_PENDING) {
        setOpen(true)
      }
    }
    
    getAccount()
  }, [])

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-md border-0 shadow-2xl p-0 gap-0"
        showCloseButton={false}
      >
        {/* Decorative header */}
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-[#740499] via-purple-600 to-[#740499] opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#740499]/20 via-purple-600/20 to-[#740499]/20 blur-sm"></div>
        </div>

        <div className="p-8 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className="bg-[#740499]/10 backdrop-blur-2xl z-40 text-[#740499] border border-[#740499]/20 px-4 py-2 text-sm font-medium"
            >
              <Clock className="w-4 h-4 mr-2" />
              Aguardando Aprovação
            </Badge>
          </div>

          {/* Icon with animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#740499]/10 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-[#740499]" />
              </div>
              {/* Subtle pulsing rings */}
              <div className="absolute inset-0 w-20 h-20 border-2 border-[#740499]/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 w-16 h-16 border border-[#740499]/10 rounded-full animate-ping animation-delay-300"></div>
            </div>
          </div>

          <DialogHeader className="space-y-4 text-center">
            <DialogTitle className="text-2xl font-semibold text-gray-900 leading-tight">
              Sua conta está quase pronta!
            </DialogTitle>
            
            <DialogDescription className="text-gray-600 text-base leading-relaxed space-y-3">
              <p>
                Recebemos sua solicitação de cadastro e nossa equipe está analisando suas informações.
              </p>
              
              <p className="font-medium text-gray-700">
                Em breve, um membro da nossa equipe entrará em contato para confirmar os detalhes e ativar sua conta na plataforma.
              </p>
            </DialogDescription>
          </DialogHeader>

          {/* Contact methods */}
          {/* <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 space-y-3">
            <h4 className="font-medium text-gray-800 text-center mb-3">
              Como entraremos em contato:
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-center space-x-2 p-3 bg-white/80 rounded-md border border-gray-100">
                <Phone className="w-4 h-4 text-[#740499]" />
                <span className="text-sm text-gray-700 font-medium">Ligação</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 p-3 bg-white/80 rounded-md border border-gray-100">
                <MessageCircle className="w-4 h-4 text-[#740499]" />
                <span className="text-sm text-gray-700 font-medium">Mensagem</span>
              </div>
            </div>
          </div> */}

          {/* Timeline indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Solicitação recebida</span>
            <div className="w-8 border-t border-dashed border-gray-300"></div>
            <Clock className="w-4 h-4 text-[#740499]" />
            <span className="font-medium text-[#740499]">Análise em andamento</span>
          </div>

          {/* Thank you note */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 italic">
              Agradecemos pela sua paciência e confiança em nossa plataforma.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};