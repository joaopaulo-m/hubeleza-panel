import { Card, CardContent } from "@/components/ui/card"
import type { AdminDashboardData } from "@/lib/api/actions/dashboard"
import { formatCurrency } from "@/lib/utils"
import { Wallet, Users, Send, TrendingDown } from "lucide-react"

interface AdminStatsCardsProps {
  data: AdminDashboardData
}

export function AdminStatsCards({ data }: AdminStatsCardsProps) {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  const stats = [
    {
      title: "Saldo Total das Carteiras",
      value: formatCurrency(data.total_wallet_balance),
      icon: Wallet,
    },
    {
      title: "Total de Parceiros",
      value: formatNumber(data.total_partners),
      icon: Users,
    },
    {
      title: "Total de Leads Enviados",
      value: formatNumber(data.total_leads_sent),
      icon: Send,
    },
    {
      title: "Total pago em taxas",
      value: formatCurrency(data.total_wallet_balance - data.total_payment_gateway_balance),
      icon: TrendingDown,
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="group border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:shadow-md hover:border-border">
            <CardContent className="px-6 py-2">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors duration-200">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground leading-none">
                      {stat.title}
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}