'use client'

import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { formatCurrency, formatDate } from "@/lib/utils";
import type { Partner } from "@/types/entities/partner";
import { getPartnerByIdAction } from "@/lib/api/actions/partner";
import type { AffiliateTransaction } from "@/types/entities/affiliate-transaction";
import type { Lead } from "@/types/entities/lead";
import { getLeadByIdAction } from "@/lib/api/actions/lead";
import { TransactionType } from "@/types/enums/transaction-type";

interface AffiliateTransactionItemProps {
  transaction: AffiliateTransaction
}

export function AffiliateTransactionItem(props: AffiliateTransactionItemProps) {
  const { transaction } = props;
  const [open, setOpen] = useState(false)
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loadingPartner, setLoadingPartner] = useState(false)
  const [lead, setLead] = useState<Lead | null>(null)
  const [loadingLead, setLoadingLead] = useState(false)

  useEffect(() => {
    async function getPartner() {
      if (props.transaction.partner_id) {
        setLoadingPartner(true)
        
        const partner = await getPartnerByIdAction(props.transaction.partner_id)

        setPartner(partner)
        setLoadingPartner(false)
      }
    }
  
    async function getLead() {
      if (props.transaction.lead_id) {
        setLoadingLead(true)
        
        const lead = await getLeadByIdAction(props.transaction.lead_id)

        setLead(lead)
        setLoadingLead(false)
      }
    }
    
    getPartner()
    getLead()
  }, [props])

  return (
    <>
      <tr key={transaction.id} onClick={() => setOpen(true)} className="hover:bg-gray-50 cursor-pointer">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {transaction.type === "INCOME" ? (
              <>
                <ArrowUp className="w-3 h-3 text-gray-400 mr-3" />
                <div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200/60 text-green-600">Entrada</div>
                </div>
              </>
            ) : (
              <>
                <ArrowDown className="w-3 h-3 text-gray-400 mr-3" />
                <div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200/60 text-purple-600">Saída</div>
                </div>
              </>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatCurrency(transaction.amount)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {(loadingPartner && !partner) && (<span>Carregando...</span>)}
          {(!loadingPartner && !partner) && (<span>*</span>)}
          {partner && (<span>{partner.name}</span>)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {(loadingLead && !lead) && (<span>Carregando...</span>)}
          {(!loadingLead && !lead) && (<span>*</span>)}
          {lead && (<span>{lead.name}</span>)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {transaction.type === TransactionType.EXPENSE && "*"}
          {partner && `${transaction.comission_percentage || 0}%`}
          {lead && `${formatCurrency(transaction.lead_comission_amount || 0)}`}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDate(transaction.created_at)}
        </td>
      </tr>
      {/* <TransactionDialog
        open={open}
        onOpenChange={setOpen}
        transaction={transaction}
      /> */}
    </>
  )
}