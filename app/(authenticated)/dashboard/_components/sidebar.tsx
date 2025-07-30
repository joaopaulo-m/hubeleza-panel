'use client'

import { usePathname, useRouter } from "next/navigation";
import { Activity, Building2, FileText, LayoutDashboard } from "lucide-react";

import { SidebarItem } from "./sidebar-item";

const Sidebar = () => {
  const { push } = useRouter()
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">MaxLeads</h2>
        <p className="text-sm text-gray-500 mt-1">Gestão de Leads Estética</p>
      </div>
      
      <nav className="px-4 space-y-2">
        <SidebarItem
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={pathname === "/dashboard"}
          onClick={() => push("/dashboard")}
        />
        <SidebarItem 
          icon={FileText} 
          label="Formulários" 
          active={pathname === "/forms"}
          onClick={() => push("/forms")}
        />
        <SidebarItem 
          icon={Building2} 
          label="Parceiros" 
          active={pathname === "/partners"}
          onClick={() => push('/partners')}
        />
        <SidebarItem 
          icon={Activity} 
          label="Tratamentos" 
          active={pathname === "/treatments"}
          onClick={() => push("/treatments")}
        />
      </nav>
    </div>
  )
};

export { Sidebar }