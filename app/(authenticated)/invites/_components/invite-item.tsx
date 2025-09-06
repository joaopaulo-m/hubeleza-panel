import { FileText } from "lucide-react";

import { DeleteInvite } from "./delete-invite";
import type { InviteToken } from "@/types/entities/invite-token";
import Link from "next/link";
import CopyInviteLinkBtn from "./copy-invite-link-btn";

interface InviteItemProps {
  inviteToken: InviteToken
}

export function InviteItem(props: InviteItemProps) {
  const { inviteToken } = props;

  return (
    <tr key={inviteToken.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">{inviteToken.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {inviteToken.phone_number}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {inviteToken.token}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(inviteToken.created_at).toLocaleString("pt-BR", {
          dateStyle: "short"
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-3">
          <Link target="__blank" href={`https://wa.me/55${inviteToken.phone_number.replace(/\D/g, '')}`}>
            <svg width={16} height={16} viewBox="0 0 32 32" fill="currentColor">
              <path d="M16.004 3.2c-7.04 0-12.8 5.76-12.8 12.8 0 2.24.576 4.352 1.6 6.208L3.2 28.8l6.816-1.792c1.76.96 3.776 1.504 6.016 1.504 7.04 0 12.8-5.76 12.8-12.8s-5.76-12.8-12.8-12.8zm0 22.4c-1.92 0-3.776-.512-5.376-1.44l-.384-.224-4.032 1.056 1.088-3.936-.224-.384c-.928-1.6-1.44-3.456-1.44-5.408 0-6.016 4.896-10.912 10.912-10.912s10.912 4.896 10.912 10.912-4.896 10.912-10.912 10.912zm5.6-8.384c-.304-.144-1.824-.896-2.112-.992s-.48-.144-.672.144c-.208.304-.768.96-.928 1.152s-.336.224-.624.08c-.304-.144-1.28-.464-2.432-1.472-.896-.8-1.504-1.776-1.68-2.08-.176-.304-.016-.464.128-.608.128-.128.304-.336.464-.512.16-.176.208-.304.304-.512.096-.208.048-.384-.016-.528-.144-.144-.672-1.6-.928-2.192-.24-.576-.48-.496-.672-.496h-.576c-.208 0-.528.08-.8.384s-1.056 1.04-1.056 2.528 1.088 2.944 1.248 3.136c.16.208 2.144 3.264 5.2 4.576.736.32 1.312.512 1.76.656.736.224 1.408.192 1.92.112.592-.08 1.824-.736 2.08-1.44.256-.704.256-1.312.176-1.44-.08-.144-.272-.208-.576-.336z" />
            </svg>
          </Link>
          <CopyInviteLinkBtn link={`https://panel.hubeleza.com.br/sign-up?token=${inviteToken.token}`} />
          <DeleteInvite invite_id={inviteToken.id} />
        </div>
      </td>
    </tr>
  )
}