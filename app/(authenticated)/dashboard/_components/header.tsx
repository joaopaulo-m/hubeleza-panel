'use client'

import { AlertCircle } from "lucide-react"
import { usePathname } from "next/navigation"

export const Header = () => {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {pathname === '/dashboard' && 'Dashboard'}
            {pathname === '/forms' && 'Formulários'}
            {pathname === '/partners' && 'Parceiros'}
            {pathname === '/treatments' && 'Tratamentos'}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">GT</span>
          </div>
        </div>
      </div>
    </header>
  )
}