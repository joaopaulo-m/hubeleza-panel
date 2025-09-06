import type { ReactNode } from "react"

import { Sidebar } from "./_components/sidebar"
import { DefinePasswordForm } from "./_components/define-password-form"

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export default function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
  const { children } = props

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
          <DefinePasswordForm />
        </main>
      </div>
    </div>
  )
}