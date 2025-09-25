import { DollarSign, Users2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const AffiliateFastActionsCard = () => {
  return (
    <Card className="w-full gap-2 border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <button className="w-full p-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 transition-colors text-left group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">Transferir saldo</div>
              <div className="text-xs text-slate-500">Enviar saldo da sua carteira</div>
            </div>
          </div>
        </button>

        <Link href="/operator/partners" className="w-full flex p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">Ver parceiros</div>
              <div className="text-xs text-slate-500">Conferir seus parceiros</div>
            </div>
          </div>
        </Link>
        
      {/*         
        <button className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Ver Relatórios</div>
              <div className="text-sm text-slate-500">Análise detalhada</div>
            </div>
          </div>
        </button> */}
      </CardContent>
    </Card>
  )
}