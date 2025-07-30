import type { ReactNode } from "react"

import { Header } from "./dashboard/_components/header"
import { Sidebar } from "./dashboard/_components/sidebar"

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export default function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
  const { children } = props

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}