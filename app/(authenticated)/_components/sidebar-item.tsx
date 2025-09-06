'use client'

import type { ElementType } from "react"

interface SidebarItemProps {
  icon: ElementType
  label: string
  active: boolean
  onClick: () => void
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${
      active 
        ? 'bg-primary/5 text-primary border-r-2 border-primary' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

export { SidebarItem } 