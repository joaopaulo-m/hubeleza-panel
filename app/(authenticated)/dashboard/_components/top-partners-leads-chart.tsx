import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, User, TrendingUp } from "lucide-react"

interface TopPartnersLeadsListProps {
  data: { partner_name: string, total_leads: number }[]
}

export function TopPartnersLeadsChart({ data }: TopPartnersLeadsListProps) {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

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

  const topFiveData = data.slice(0, 5)

  return (
    <Card className="min-h-full shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-foreground" />
          Top Parceiros - Leads
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ranking por número de leads enviados
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {topFiveData.map((partner, index) => (
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
              <p className="text-sm text-muted-foreground">
                {formatNumber(partner.total_leads)} leads
              </p>
            </div>

            {/* Leads Count Badge */}
            <div className="flex-shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-background/80 border border-border/50">
                <span className="font-semibold text-foreground">
                  {formatNumber(partner.total_leads)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Summary */}
        {topFiveData.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total dos Top 5</span>
              <span className="font-semibold">
                {formatNumber(topFiveData.reduce((sum, partner) => sum + partner.total_leads, 0))} leads
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}