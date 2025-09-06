import React, { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

import { 
  MapPin,
  Plus, 
  X, 
  Search,
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { CurrencyInput } from "@/components/ui/currency-input"

// Enum dos estados brasileiros
export enum State {
  AC = "AC", AL = "AL", AP = "AP", AM = "AM", BA = "BA", CE = "CE",
  DF = "DF", ES = "ES", GO = "GO", MA = "MA", MT = "MT", MS = "MS",
  MG = "MG", PA = "PA", PB = "PB", PR = "PR", PE = "PE", PI = "PI",
  RJ = "RJ", RN = "RN", RS = "RS", RO = "RO", RR = "RR", SC = "SC",
  SP = "SP", SE = "SE", TO = "TO"
}

// Mapeamento de estados com nomes completos e regiões
const STATE_INFO = {
  [State.AC]: { name: "Acre", region: "Norte" },
  [State.AL]: { name: "Alagoas", region: "Nordeste" },
  [State.AP]: { name: "Amapá", region: "Norte" },
  [State.AM]: { name: "Amazonas", region: "Norte" },
  [State.BA]: { name: "Bahia", region: "Nordeste" },
  [State.CE]: { name: "Ceará", region: "Nordeste" },
  [State.DF]: { name: "Distrito Federal", region: "Centro-Oeste" },
  [State.ES]: { name: "Espírito Santo", region: "Sudeste" },
  [State.GO]: { name: "Goiás", region: "Centro-Oeste" },
  [State.MA]: { name: "Maranhão", region: "Nordeste" },
  [State.MT]: { name: "Mato Grosso", region: "Centro-Oeste" },
  [State.MS]: { name: "Mato Grosso do Sul", region: "Centro-Oeste" },
  [State.MG]: { name: "Minas Gerais", region: "Sudeste" },
  [State.PA]: { name: "Pará", region: "Norte" },
  [State.PB]: { name: "Paraíba", region: "Nordeste" },
  [State.PR]: { name: "Paraná", region: "Sul" },
  [State.PE]: { name: "Pernambuco", region: "Nordeste" },
  [State.PI]: { name: "Piauí", region: "Nordeste" },
  [State.RJ]: { name: "Rio de Janeiro", region: "Sudeste" },
  [State.RN]: { name: "Rio Grande do Norte", region: "Nordeste" },
  [State.RS]: { name: "Rio Grande do Sul", region: "Sul" },
  [State.RO]: { name: "Rondônia", region: "Norte" },
  [State.RR]: { name: "Roraima", region: "Norte" },
  [State.SC]: { name: "Santa Catarina", region: "Sul" },
  [State.SP]: { name: "São Paulo", region: "Sudeste" },
  [State.SE]: { name: "Sergipe", region: "Nordeste" },
  [State.TO]: { name: "Tocantins", region: "Norte" }
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

export interface StatePriceData {
  state: State
  price: number
}

interface TreatmentStatePriceInputProps {
  basePrice: number
  statePrices: StatePriceData[]
  onStatePricesChange: (statePrices: StatePriceData[]) => void
  disabled?: boolean
  className?: string
}

export function TreatmentStatePriceInput({
  basePrice,
  statePrices,
  onStatePricesChange,
  disabled = false,
  className,
}: TreatmentStatePriceInputProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeRegion, setActiveRegion] = useState<string | "all">("all")

  // Calcular diferença percentual
  const calculateDifference = (statePrice: number, basePrice: number) => {
    if (basePrice === 0) return 0
    return ((statePrice - basePrice) / basePrice) * 100
  }

  // Agrupar estados por região
  const statesByRegion = useMemo(() => {
    const grouped = Object.entries(STATE_INFO).reduce((acc, [state, info]) => {
      if (!acc[info.region]) {
        acc[info.region] = []
      }
      acc[info.region].push({
        state: state as State,
        name: info.name,
        region: info.region
      })
      return acc
    }, {} as Record<string, Array<{ state: State; name: string; region: string }>>)

    // Ordenar estados dentro de cada região
    Object.values(grouped).forEach(states => {
      states.sort((a, b) => a.name.localeCompare(b.name))
    })

    return grouped
  }, [])

  // Filtrar estados baseado na busca e região ativa
  const filteredStates = useMemo(() => {
    let states = Object.entries(STATE_INFO).map(([state, info]) => ({
      state: state as State,
      ...info
    }))

    if (activeRegion !== "all") {
      states = states.filter(state => state.region === activeRegion)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      states = states.filter(state => 
        state.name.toLowerCase().includes(query) || 
        state.state.toLowerCase().includes(query)
      )
    }

    return states
  }, [searchQuery, activeRegion])

  // Obter preço para um estado específico
  const getStatePrice = useCallback((state: State) => {
    const statePrice = statePrices.find(sp => sp.state === state)
    return statePrice ? statePrice.price : basePrice
  }, [statePrices, basePrice])

  // Verificar se um estado tem preço customizado
  const hasCustomPrice = useCallback((state: State) => {
    return statePrices.some(sp => sp.state === state)
  }, [statePrices])

  // Adicionar preço customizado para um estado
  const addStatePrice = useCallback((state: State, price?: number) => {
    if (disabled) return

    const newPrice = price ?? basePrice
    const exists = statePrices.some(sp => sp.state === state)
    
    if (!exists) {
      onStatePricesChange([...statePrices, { state, price: newPrice }])
    }
  }, [disabled, statePrices, basePrice, onStatePricesChange])

  // Remover preço customizado de um estado
  const removeStatePrice = useCallback((state: State) => {
    if (disabled) return
    onStatePricesChange(statePrices.filter(sp => sp.state !== state))
  }, [disabled, statePrices, onStatePricesChange])

  // Atualizar preço de um estado
  const updateStatePrice = useCallback((state: State, price: number) => {
    if (disabled) return
    
    onStatePricesChange(
      statePrices.map(sp => 
        sp.state === state ? { ...sp, price } : sp
      )
    )
  }, [disabled, statePrices, onStatePricesChange])

  const regions = Object.keys(statesByRegion)

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Preços por Estado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-primary" />
            Preços Específicos por Estado
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={disabled}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeRegion} onValueChange={setActiveRegion} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {regions.map(region => (
                <TabsTrigger key={region} value={region} className="text-xs">
                  {region}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <StateList 
                states={filteredStates}
                statePrices={statePrices}
                basePrice={basePrice}
                onAddStatePrice={addStatePrice}
                onRemoveStatePrice={removeStatePrice}
                onUpdateStatePrice={updateStatePrice}
                getStatePrice={getStatePrice}
                hasCustomPrice={hasCustomPrice}
                calculateDifference={calculateDifference}
                formatCurrency={formatCurrency}
                disabled={disabled}
              />
            </TabsContent>

            {regions.map(region => (
              <TabsContent key={region} value={region}>
                <StateList 
                  states={statesByRegion[region]}
                  statePrices={statePrices}
                  basePrice={basePrice}
                  onAddStatePrice={addStatePrice}
                  onRemoveStatePrice={removeStatePrice}
                  onUpdateStatePrice={updateStatePrice}
                  getStatePrice={getStatePrice}
                  hasCustomPrice={hasCustomPrice}
                  calculateDifference={calculateDifference}
                  formatCurrency={formatCurrency}
                  disabled={disabled}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Estados com Preços Customizados */}
      {statePrices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estados com Preços Customizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {statePrices.map(({ state, price }) => {
                const stateInfo = STATE_INFO[state]
                const difference = calculateDifference(price, basePrice)
                const regionColor = REGION_COLORS[stateInfo.region as Region]
                
                return (
                  <div key={state} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={regionColor}>
                        {state}
                      </Badge>
                      <div>
                        <p className="font-medium">{stateInfo.name}</p>
                        <p className="text-sm text-muted-foreground">{stateInfo.region}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(price)}</p>
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente auxiliar para listar estados
interface StateListProps {
  states: Array<{ state: State; name: string; region: string }>
  statePrices: StatePriceData[]
  basePrice: number
  onAddStatePrice: (state: State, price?: number) => void
  onRemoveStatePrice: (state: State) => void
  onUpdateStatePrice: (state: State, price: number) => void
  getStatePrice: (state: State) => number
  hasCustomPrice: (state: State) => boolean
  calculateDifference: (statePrice: number, basePrice: number) => number
  formatCurrency: (value: number) => string
  disabled: boolean
}

function StateList({
  states,
  basePrice,
  onAddStatePrice,
  onRemoveStatePrice, 
  onUpdateStatePrice,
  getStatePrice,
  hasCustomPrice,
  calculateDifference,
  formatCurrency,
  disabled
}: StateListProps) {
  if (states.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Search className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">Nenhum estado encontrado</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-96">
      <div className="space-y-2 pr-4">
        {states.map(({ state, name, region }) => {
          const price = getStatePrice(state)
          const isCustom = hasCustomPrice(state)
          const difference = calculateDifference(price, basePrice)
          const regionColor = REGION_COLORS[region as Region]

          return (
            <div
              key={state}
              className={cn(
                "flex items-center justify-between p-3 border rounded-lg transition-all",
                isCustom && "bg-primary/5 border-primary/20"
              )}
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={regionColor}>
                  {state}
                </Badge>
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-muted-foreground">{region}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isCustom ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CurrencyInput 
                        value={price}
                        onChange={(e) => onUpdateStatePrice(state, Number(e))}
                        className="w-32 text-right"
                        disabled={disabled}
                      />
                      {/* <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={price || ""}
                        onChange={(e) => onUpdateStatePrice(state, Number(e.target.value))}
                        className="w-32 text-right"
                        disabled={disabled}
                      /> */}
                      {difference !== 0 && (
                        <Badge 
                          variant="secondary"
                          className={cn(
                            difference > 0 ? "text-green-600" : "text-red-600"
                          )}
                        >
                          {difference > 0 ? "+" : ""}{difference.toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => onRemoveStatePrice(state)}
                      disabled={disabled}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-right">
                      <p className="text-muted-foreground">{formatCurrency(basePrice)}</p>
                      <p className="text-xs text-muted-foreground">Preço base</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddStatePrice(state)}
                      disabled={disabled}
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}