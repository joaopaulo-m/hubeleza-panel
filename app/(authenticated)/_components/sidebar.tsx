'use client'

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Activity, ArrowUpDown, Building2, FileText, Home, LayoutDashboard, LogOut, UserPlus, Users, Users2Icon } from "lucide-react";
import Image from "next/image";

import { SidebarItem } from "./sidebar-item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { getAccountType, getMe, logout } from "@/lib/api/actions/auth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AccountType } from "@/types/enums/account-type";

const Sidebar = () => {
  const [accountName, setAccountName] = useState("")
  const [accountType, setAccountType] = useState(AccountType.PARTNER)

  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function getCurrentAccountType() {
      const account_type = await getAccountType()
      
      if (account_type) {
        setAccountType(account_type)
      }
    }

    async function getAccountName() {
      const account = await getMe()

      setAccountName(account.name)
    }
    
    getCurrentAccountType()
    getAccountName()
  }, [])

  async function onLogOutClick() {
    try {
      await logout()
      push("/auth")
    } catch {}
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen relative">
      <div className="p-6 mb-5">
        <Image 
          src="/logo-variant.png"
          alt="Logo"
          width={150}
          height={75}
        />
      </div>
      
      <nav className="px-4 space-y-2">
        {/* Admin sidebar items */}
        {(accountType === AccountType.ADMIN || accountType === AccountType.OPERATOR) && (
          <>
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
            <SidebarItem 
              icon={UserPlus} 
              label="Convites" 
              active={pathname === "/invites"}
              onClick={() => push("/invites")}
            />
            {accountType === AccountType.ADMIN && (
              <SidebarItem 
                icon={Users} 
                label="Operadores" 
                active={pathname === "/operators"}
                onClick={() => push("/operators")}
              />
            )}
          </>
        )}

        {accountType === AccountType.PARTNER && (
          <>
            <SidebarItem 
              icon={Home} 
              label="Início" 
              active={pathname === "/partner/home"}
              onClick={() => push("/partner/home")}
            />
            <SidebarItem 
              icon={Users2Icon} 
              label="Leads" 
              active={pathname === "/partner/leads"}
              onClick={() => push("/partner/leads")}
            />
            <SidebarItem 
              icon={ArrowUpDown} 
              label="Transações" 
              active={pathname === "/partner/transactions"}
              onClick={() => push("/partner/transactions")}
            />
          </>
        )}
      </nav>
      <div className="absolute bottom-6 w-full px-6 flex justify-between items-center">
        <Avatar>
          <AvatarFallback>
            {getInitials(accountName)}
          </AvatarFallback>
        </Avatar>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" className="p-2 rounded-md bg-slate-100 cursor-pointer">
              <LogOut className="rotate-180" size={14} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Certeza que deseja sair?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onLogOutClick}>Sair</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
};

export { Sidebar }