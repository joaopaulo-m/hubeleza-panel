'use client';

import { Badge } from '@/components/ui/badge';
import { Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  name: string;
  phone_number: string;
  cep: string;
  created_at: number;
  treatments: Treatment[];
}

interface Treatment {
  id: string;
  name: string;
  price: number;
}

interface LeadItemProps {
  lead: Lead;
}

export function LeadItem({ lead }: LeadItemProps) {
  const formatPhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');

    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return phone;
  };

  const formatCEP = (cep: string) => {
    const numbers = cep.replace(/\D/g, '');
    
    if (numbers.length === 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return cep;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{formatPhoneNumber(lead.phone_number)}</span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{formatCEP(lead.cep)}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-2">
          {lead.treatments.length === 0 ? (
            <span className="text-sm text-gray-500">Nenhum tratamento</span>
          ) : (
            <>
              <div className="flex flex-wrap gap-1">
                {lead.treatments.slice(0, 2).map((treatment) => (
                  <Badge key={treatment.id} variant="secondary" className="text-xs">
                    {treatment.name}
                  </Badge>
                ))}
                {lead.treatments.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{lead.treatments.length - 2} mais
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}
        </div>
        <div className="text-xs text-gray-500">
          {format(new Date(lead.created_at), 'HH:mm', { locale: ptBR })}
        </div>
      </td>
    </tr>
  );
}