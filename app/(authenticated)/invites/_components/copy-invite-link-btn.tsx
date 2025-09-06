'use client'

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyInviteLinkBtnProps {
  link: string
}

export default function CopyInviteLinkBtn(props: CopyInviteLinkBtnProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <button onClick={handleCopy} className="text-gray-600 hover:text-gray-900 cursor-pointer">
      {!copied ? (<Copy className="w-4 h-4" />) : (<Check className="w-4 h-4" />)}
    </button>
  );
}
