import React from "react"
import {
  Activity, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp,
  Info,
  BarChart3,
  Globe
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { TreatmentData } from "@/types/entities/dashboard"
import type { Treatment } from "@/types/entities/treatment"
import { TreatmentCategory } from "@/types/enums/treatment-category"
import { cn, formatCurrency } from "@/lib/utils"

// Mapeamento de estados brasileiros
const STATE_INFO = {
  AC: { name: "Acre", region: "Norte" },
  AL: { name: "Alagoas", region: "Nordeste" },
  AP: { name: "Amapá", region: "Norte" },
  AM: { name: "Amazonas", region: "Norte" },
  BA: { name: "Bahia", region: "Nordeste" },
  CE: { name: "Ceará", region: "Nordeste" },
  DF: { name: "Distrito Federal", region: "Centro-Oeste" },
  ES: { name: "Espírito Santo", region: "Sudeste" },
  GO: { name: "Goiás", region: "Centro-Oeste" },
  MA: { name: "Maranhão", region: "Nordeste" },
  MT: { name: "Mato Grosso", region: "Centro-Oeste" },
  MS: { name: "Mato Grosso do Sul", region: "Centro-Oeste" },
  MG: { name: "Minas Gerais", region: "Sudeste" },
  PA: { name: "Pará", region: "Norte" },
  PB: { name: "Paraíba", region: "Nordeste" },
  PR: { name: "Paraná", region: "Sul" },
  PE: { name: "Pernambuco", region: "Nordeste" },
  PI: { name: "Piauí", region: "Nordeste" },
  RJ: { name: "Rio de Janeiro", region: "Sudeste" },
  RN: { name: "Rio Grande do Norte", region: "Nordeste" },
  RS: { name: "Rio Grande do Sul", region: "Sul" },
  RO: { name: "Rondônia", region: "Norte" },
  RR: { name: "Roraima", region: "Norte" },
  SC: { name: "Santa Catarina", region: "Sul" },
  SP: { name: "São Paulo", region: "Sudeste" },
  SE: { name: "Sergipe", region: "Nordeste" },
  TO: { name: "Tocantins", region: "Norte" }
}

// Cores por região
type Region = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

const REGION_COLORS: Record<Region, string> = {
  "Norte": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Nordeste": "bg-orange-50 text-orange-700 border-orange-200",
  "Centro-Oeste": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Sudeste": "bg-blue-50 text-blue-700 border-blue-200",
  "Sul": "bg-purple-50 text-purple-700 border-purple-200"
}

// Configuração das categorias
const CATEGORY_CONFIG = {
  [TreatmentCategory.FACIAL]: {
    label: "Facial",
    icon: Activity,
    color: "bg-pink-50 text-pink-700 border-pink-200",
    gradient: "from-pink-500 to-rose-500"
  },
  [TreatmentCategory.BODY]: {
    label: "Corporal",
    icon: Users,
    color: "bg-blue-50 text-blue-700 border-blue-200", 
    gradient: "from-blue-500 to-cyan-500"
  },
  [TreatmentCategory.HAIR_REMOVAL]: {
    label: "Depilação",
    icon: Activity,
    color: "bg-green-50 text-green-700 border-green-200",
    gradient: "from-green-500 to-emerald-500"
  },
  [TreatmentCategory.HAIR]: {
    label: "Cabelo",
    icon: Activity,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    gradient: "from-purple-500 to-violet-500"
  },
  [TreatmentCategory.WELLNESS]: {
    label: "Bem-estar",
    icon: Activity,
    color: "bg-orange-50 text-orange-700 border-orange-200",
    gradient: "from-orange-500 to-amber-500"
  }
}

interface TreatmentDetailsDialogProps {
  name: string
  data: TreatmentData
  treatment: Treatment
}

export function TreatmentDetailsDialog({ name, data, treatment }: TreatmentDetailsDialogProps) {
  const categoryConfig = CATEGORY_CONFIG[treatment.category]
  const CategoryIcon = categoryConfig.icon

  // Calcular estatísticas dos preços (função pura)
  const calculatePriceStats = (basePrice: number, statePrices: Array<{ price: number }>) => {
    if (statePrices.length === 0) {
      return {
        hasVariations: false,
        minPrice: basePrice,
        maxPrice: basePrice,
        avgPrice: basePrice,
        statesWithCustomPrices: 0
      }
    }

    const allPrices = [basePrice, ...statePrices.map(sp => sp.price)]
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const avgPrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
    
    return {
      hasVariations: minPrice !== maxPrice,
      minPrice,
      maxPrice,
      avgPrice,
      statesWithCustomPrices: statePrices.length
    }
  }

  const priceStats = calculatePriceStats(treatment.price, treatment.state_prices)

  // Agrupar preços por região (função pura)
  const groupPricesByRegion = (statePrices: Array<{ id: string; treatment_id: string; state: string; price: number }>) => {
    return statePrices.reduce((acc, statePrice) => {
      const stateInfo = STATE_INFO[statePrice.state as keyof typeof STATE_INFO]
      if (stateInfo) {
        if (!acc[stateInfo.region]) {
          acc[stateInfo.region] = []
        }
        acc[stateInfo.region].push({
          ...statePrice,
          stateName: stateInfo.name,
          region: stateInfo.region
        })
      }
      return acc
    }, {} as Record<string, Array<{
      id: string
      treatment_id: string
      state: string
      price: number
      stateName: string
      region: string
    }>>)
  }

  const pricesByRegion = groupPricesByRegion(treatment.state_prices)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex-1 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all duration-200"
        >
          <Info className="w-4 h-4 mr-2" />
          Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[50vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
              categoryConfig.gradient
            )}>
              <CategoryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>{name}</span>
              <Badge variant="outline" className={cn("ml-3 text-xs", categoryConfig.color)}>
                {categoryConfig.label}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Informações completas e análise de preços do tratamento
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="pricing">Análise de Preços</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FileText className="w-4 h-4" />
                    Formulários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{data.form_count}</p>
                  <p className="text-xs text-gray-500 mt-1">Total de formulários</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Users className="w-4 h-4" />
                    Parceiros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{data.partner_count}</p>
                  <p className="text-xs text-gray-500 mt-1">Clínicas cadastradas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    Leads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{data.lead_count}</p>
                  <p className="text-xs text-gray-500 mt-1">Total gerado</p>
                </CardContent>
              </Card>
            </div>

            {/* Resumo de Preços */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Resumo de Preços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900/75">{formatCurrency(treatment.price)}</p>
                    <p className="text-sm text-gray-500">Preço Base</p>
                  </div>
                  {priceStats.hasVariations && (
                    <>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600/75">{formatCurrency(priceStats.minPrice)}</p>
                        <p className="text-sm text-gray-500">Menor Preço</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600/75">{formatCurrency(priceStats.maxPrice)}</p>
                        <p className="text-sm text-gray-500">Maior Preço</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-600/75">{formatCurrency(priceStats.avgPrice)}</p>
                        <p className="text-sm text-gray-500">Preço Médio</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Análise de Preços */}
          <TabsContent value="pricing" className="space-y-4">
            {treatment.state_prices.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Globe className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-600">Preço Único</p>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Este tratamento usa o mesmo preço ({formatCurrency(treatment.price)}) em todos os estados
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Estatísticas de Variação */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Variação de Preços
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-sm">
                        {priceStats.statesWithCustomPrices} estados com preços personalizados
                      </Badge>
                      <div className="text-sm text-gray-500">
                        Variação: {(((priceStats.maxPrice - priceStats.minPrice) / priceStats.minPrice) * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    {/* Lista de Preços por Região */}
                    <div className="space-y-4">
                      {Object.entries(pricesByRegion).map(([region, statePrices]) => (
                        <div key={region} className="space-y-2">
                          <h4 className="font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {region}
                          </h4>
                          <div className="grid gap-2">
                            {statePrices.map((statePrice) => {
                              const difference = ((statePrice.price - treatment.price) / treatment.price) * 100
                              const regionColor = REGION_COLORS[region as Region]
                              
                              return (
                                <div key={statePrice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline" className={regionColor}>
                                      {statePrice.state}
                                    </Badge>
                                    <span className="font-medium">{statePrice.stateName}</span>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">{formatCurrency(statePrice.price)}</p>
                                    {difference !== 0 && (
                                      <p className={cn(
                                        "text-xs",
                                        difference > 0 ? "text-green-600" : "text-red-600"
                                      )}>
                                        {difference > 0 ? "+" : ""}{difference.toFixed(1)}%
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Detalhes */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID do Tratamento:</span>
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm">{treatment.id}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoria:</span>
                    <Badge variant="outline" className={categoryConfig.color}>
                      {categoryConfig.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estados com preços customizados:</span>
                    <span className="font-medium">{treatment.state_prices.length}/27</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{data.form_count}</p>
                      <p className="text-sm text-gray-500">Formulários</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{data.partner_count}</p>
                      <p className="text-sm text-gray-500">Parceiros</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{data.lead_count}</p>
                      <p className="text-sm text-gray-500">Leads</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Média de leads por formulário:</span>
                      <span className="font-medium">
                        {data.form_count > 0 ? (data.lead_count / data.form_count).toFixed(1) : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Média de leads por parceiro:</span>
                      <span className="font-medium">
                        {data.partner_count > 0 ? (data.lead_count / data.partner_count).toFixed(1) : '0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}