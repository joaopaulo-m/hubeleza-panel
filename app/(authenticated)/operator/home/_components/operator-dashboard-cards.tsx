import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OperatorDashboardData } from "@/lib/api/actions/dashboard";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Users } from "lucide-react";

interface OperatorDashboardCardsProps {
  data: OperatorDashboardData;
}

export const OperatorDashboardCards: React.FC<OperatorDashboardCardsProps> = ({ data }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300 group">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" /> */}
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Cadastro
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">
              {formatCurrency(data.sign_up_comission_amount)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Comissão recebida</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300 group">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" /> */}
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Recarga
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">
              {formatCurrency(data.topup_comission_amount)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Comissão recebida</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300 group">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" /> */}
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Parceiros
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">
              {data.total_partners}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>Criados por você</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};