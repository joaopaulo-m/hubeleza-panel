'use client'

import { BarChart3, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LeadsPerTreatmentDialog = ({ leads_per_treatment }: { leads_per_treatment: { treatment: string; count: number }[] }) => {
  const [open, setOpen] = useState(false);
  
  const sortedTreatments = [...leads_per_treatment].sort((a, b) => b.count - a.count);
  const totalLeads = leads_per_treatment.reduce((sum, item) => sum + item.count, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between p-0 h-auto font-normal hover:bg-transparent group"
        >
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Ver detalhes
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Leads por Tratamento
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total de Leads</div>
              <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Tratamentos Ativos</div>
              <div className="text-2xl font-bold">{sortedTreatments.length}</div>
            </div>
          </div>
          
          {/* <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-3">
              {sortedTreatments.map((item, index) => {
                const percentage = totalLeads > 0 ? (item.count / totalLeads) * 100 : 0;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm truncate pr-2">
                        {item.treatment}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                        <span className="font-semibold text-sm">
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};