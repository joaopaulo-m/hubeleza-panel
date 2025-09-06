import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PartnerDashboardData } from "@/lib/api/actions/dashboard";
import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";
// import { LeadsPerTreatmentDialog } from "./leads-per-treatment-dialog";

interface PartnerDashboardCardsProps {
  data: PartnerDashboardData;
}

const PartnerDashboardCards: React.FC<PartnerDashboardCardsProps> = ({ data }) => {
  const { total_leads, total_treatments, leads_per_treatment } = data;

  // Calculate top treatment
  const topTreatment = leads_per_treatment.length > 0 
    ? leads_per_treatment.reduce((prev, current) => 
        prev.count > current.count ? prev : current
      )
    : null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Leads Card */}
      <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300 group">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" /> */}
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Leads
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">
              {total_leads.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Leads recebidos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Treatments Card */}
      <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300 group">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tratamentos Cadastrados
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">
              {total_treatments.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                Ativos
              </Badge>
              <span>Tratamentos disponíveis</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads per Treatment Card */}
      <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300 group md:col-span-2 lg:col-span-1">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Performance por Tratamento
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0 space-y-4">
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">
              {leads_per_treatment.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Tratamentos com leads
            </div>
          </div>
          
          {topTreatment && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Top Performance
              </div>
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {topTreatment.treatment}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {topTreatment.count} leads
                  </div>
                </div>
                <Badge className="ml-2 shrink-0">
                  #1
                </Badge>
              </div>
            </div>
          )}
          
          {/* <div className="pt-2 border-t border-muted/30">
            <LeadsPerTreatmentDialog leads_per_treatment={leads_per_treatment} />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerDashboardCards;