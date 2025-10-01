'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface AffiliateLinkCopyProps {
  affiliate_code: string
}

export default function AffiliateLinkCopy(props: AffiliateLinkCopyProps) {
  const [affiliateLink, setAffiliateLink] = useState('')
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  useEffect(() => {
    setAffiliateLink(`https://hubeleza.com.br?affiliate_code=${props.affiliate_code}`)
  }, [props.affiliate_code])

  return (
    <div className="w-fit">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">
          Seu Link de Afiliado:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="flex-1 min-w-[250px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}