import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Trophy, Medal, Award, User, DollarSign } from "lucide-react"

interface TopPartnersDepositListProps {
  data: { partner_name: string, total_deposit: number }[]
}

export function TopPartnersDepositChart({ data }: TopPartnersDepositListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const total = data.reduce((sum, item) => sum + item.total_deposit, 0)

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-5 w-5 text-yellow-500" />
      case 1: return <Medal className="h-5 w-5 text-gray-400" />
      case 2: return <Award className="h-5 w-5 text-amber-600" />
      default: return <User className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
      case 1: return "border-gray-200 bg-gray-50 hover:bg-gray-100"
      case 2: return "border-amber-200 bg-amber-50 hover:bg-amber-100"
      default: return "border-border/50 bg-card/30 hover:bg-card/50"
    }
  }

  const getPercentage = (value: number) => {
    return ((value / total) * 100).toFixed(1)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent flex items-center gap-2">
          <Wallet className="h-5 w-5 text-foreground" />
          Top Parceiros - Depósitos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ranking por valor total de depósito
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Total Summary Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span className="font-medium text-emerald-800">Total Geral</span>
            </div>
            <span className="text-lg font-bold text-emerald-700">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Partners Ranking */}
        {data.map((partner, index) => (
          <div 
            key={partner.partner_name} 
            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${getRankStyle(index)}`}
          >
            {/* Rank Position */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 border border-border/50 font-semibold text-sm">
              {index + 1}
            </div>

            {/* Rank Icon */}
            <div className="flex-shrink-0">
              {getRankIcon(index)}
            </div>

            {/* Partner Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {partner.partner_name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  {getPercentage(partner.total_deposit)}% do total
                </p>
                {/* Progress Bar */}
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary/60 rounded-full transition-all duration-500"
                    style={{ width: `${getPercentage(partner.total_deposit)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Deposit Amount */}
            <div className="flex-shrink-0 text-right">
              <div className="px-3 py-1.5 rounded-lg bg-background/80 border border-border/50">
                <span className="font-semibold text-foreground">
                  {formatCurrency(partner.total_deposit)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Top 3 Summary */}
        {data.length > 2 && (
          <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Top 3 Parceiros</span>
                <span className="font-semibold">
                  {formatCurrency(data.slice(0, 3).reduce((sum, partner) => sum + partner.total_deposit, 0))}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Representam do total</span>
                <span className="font-medium">
                  {((data.slice(0, 3).reduce((sum, partner) => sum + partner.total_deposit, 0) / total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}