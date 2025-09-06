import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import type { Treatment } from "@/types/entities/treatment"
import { TreatmentCategory } from "@/types/enums/treatment-category"
import { getTreatmentsAction } from "@/lib/api/actions/treatment"
import { Check, Search, X, Sparkles, User, Scissors, Heart } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"

interface TreatmentSelectorProps {
  value: string[] // Array de IDs dos tratamentos selecionados
  onChange: (value: string[]) => void // Callback para mudanças
  state?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  preloadedTreatments?: Treatment[] // Para evitar fetch desnecessários
  showSelectedCount?: boolean
  maxHeight?: string
}

// Configurações das categorias com ícones e labels
const CATEGORY_CONFIG = {
  [TreatmentCategory.FACIAL]: {
    label: "Facial",
    icon: Sparkles,
    color: "bg-pink-50 text-pink-700 border-pink-200"
  },
  [TreatmentCategory.BODY]: {
    label: "Corporal",
    icon: User,
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  [TreatmentCategory.HAIR_REMOVAL]: {
    label: "Depilação",
    icon: Scissors,
    color: "bg-green-50 text-green-700 border-green-200"
  },
  [TreatmentCategory.HAIR]: {
    label: "Cabelo",
    icon: Scissors,
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
  [TreatmentCategory.WELLNESS]: {
    label: "Bem-estar",
    icon: Heart,
    color: "bg-orange-50 text-orange-700 border-orange-200"
  }
}

export function TreatmentSelector({
  value = [],
  onChange,
  placeholder = "Selecione tratamentos",
  disabled = false,
  className,
  preloadedTreatments,
  showSelectedCount = true,
  maxHeight = "400px",
  state
}: TreatmentSelectorProps) {
  const [treatments, setTreatments] = useState<Treatment[]>(preloadedTreatments || [])
  const [loading, setLoading] = useState(!preloadedTreatments)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<TreatmentCategory | "all">("all")

  // Agrupar tratamentos por categoria
  const treatmentsByCategory = useMemo(() => {
    const grouped = treatments.reduce((acc, treatment) => {
      if (!acc[treatment.category]) {
        acc[treatment.category] = []
      }
      acc[treatment.category].push(treatment)
      return acc
    }, {} as Record<TreatmentCategory, Treatment[]>)
    
    return grouped
  }, [treatments])

  // Filtrar tratamentos com base na busca e categoria ativa
  const filteredTreatments = useMemo(() => {
    let filtered = treatments

    // Filtrar por categoria se não for "all"
    if (activeCategory !== "all") {
      filtered = filtered.filter(treatment => treatment.category === activeCategory)
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const normalizeString = (str: string) => 
        str.toLowerCase()
           .normalize('NFD')
           .replace(/[\u0300-\u036f]/g, '') // Remove acentos
           .trim()

      const normalizedQuery = normalizeString(searchQuery)
      
      filtered = filtered.filter(treatment => 
        normalizeString(treatment.name).includes(normalizedQuery)
      )
    }

    return filtered
  }, [treatments, searchQuery, activeCategory])

  // Buscar tratamentos se não foram pré-carregados
  useEffect(() => {
    async function fetchTreatments() {
      if (preloadedTreatments) return

      try {
        setLoading(true)
        const fetchedTreatments = await getTreatmentsAction()
        setTreatments(fetchedTreatments)
      } catch (error) {
        console.error("Erro ao buscar tratamentos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTreatments()
  }, [preloadedTreatments])

  // Função para alternar seleção de um tratamento - usando useCallback para evitar re-renders desnecessários
  const toggleTreatment = useCallback((treatmentId: string) => {
    if (disabled) return
    
    const isCurrentlySelected = value.includes(treatmentId)
    const newValue = isCurrentlySelected
      ? value.filter(id => id !== treatmentId)
      : [...value, treatmentId]
    
    onChange(newValue)
  }, [disabled, value, onChange])

  // Função para limpar todas as seleções
  const clearAll = useCallback(() => {
    if (disabled) return
    onChange([])
  }, [disabled, onChange])

  // Função para selecionar todos os tratamentos filtrados
  const selectAllFiltered = useCallback(() => {
    if (disabled) return
    const filteredIds = filteredTreatments.map(t => t.id)
    const newSelection = [...new Set([...value, ...filteredIds])]
    onChange(newSelection)
  }, [disabled, filteredTreatments, value, onChange])

  // Função para selecionar todos de uma categoria
  const selectAllInCategory = useCallback((category: TreatmentCategory) => {
    if (disabled) return
    const categoryTreatments = treatmentsByCategory[category] || []
    const categoryIds = categoryTreatments.map(t => t.id)
    const newSelection = [...new Set([...value, ...categoryIds])]
    onChange(newSelection)
  }, [disabled, treatmentsByCategory, value, onChange])

  // Remover tratamento selecionado
  const removeTreatment = useCallback((treatmentId: string) => {
    if (disabled) return
    const newValue = value.filter(id => id !== treatmentId)
    onChange(newValue)
  }, [disabled, value, onChange])

  // Obter tratamentos selecionados com informações completas
  const selectedTreatments = useMemo(() => {
    return value.map(id => treatments.find(t => t.id === id)).filter(Boolean) as Treatment[]
  }, [value, treatments])

  // Contar tratamentos por categoria
  const getCategoryCount = useCallback((category: TreatmentCategory) => {
    return treatmentsByCategory[category]?.length || 0
  }, [treatmentsByCategory])

  // Contar selecionados por categoria
  const getSelectedInCategory = useCallback((category: TreatmentCategory) => {
    const categoryTreatments = treatmentsByCategory[category] || []
    return categoryTreatments.filter(t => value.includes(t.id)).length
  }, [treatmentsByCategory, value])

  return (
    <Card className={cn("w-full py-5", className)}>
      <CardHeader className="">
        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar tratamentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>
        
        {/* Tratamentos Selecionados */}
        {value.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Selecionados ({value.length})
              </span>
              {value.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  disabled={disabled}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar Tudo
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {selectedTreatments.map((treatment) => {
                const config = CATEGORY_CONFIG[treatment.category]
                return (
                  <Badge
                    key={treatment.id}
                    variant="secondary"
                    className={cn("text-xs", config.color)}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTreatment(treatment.id)
                    }}
                  >
                    {treatment.name}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer hover:bg-black/10 rounded-full"
                    />
                  </Badge>
                )
              })}
            </div>
            <Separator />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Tabs 
          value={activeCategory} 
          onValueChange={(value) => setActiveCategory(value as TreatmentCategory | "all")}
          className="w-full"
        >
          <TabsList className="grid w-full h-full grid-cols-6 mb-4">
            <TabsTrigger value="all" className="text-xs">
              Todos ({treatments.length})
            </TabsTrigger>
            {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
              const Icon = config.icon
              const count = getCategoryCount(category as TreatmentCategory)
              const selected = getSelectedInCategory(category as TreatmentCategory)
              
              return (
                <TabsTrigger key={category} value={category} className="text-xs flex flex-col gap-1 py-3">
                  <div className="flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{config.label}</span>
                  </div>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {filteredTreatments.length} tratamentos encontrados
              </span>
              {filteredTreatments.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllFiltered}
                  disabled={disabled || filteredTreatments.every(t => value.includes(t.id))}
                >
                  Selecionar Todos
                </Button>
              )}
            </div>
            <TreatmentList 
              treatments={filteredTreatments}
              selectedIds={value}
              onToggle={toggleTreatment}
              loading={loading}
              searchQuery={searchQuery}
              disabled={disabled}
              maxHeight={maxHeight}
              state={state}
            />
          </TabsContent>

          {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
            const categoryTreatments = treatmentsByCategory[category as TreatmentCategory] || []
            const filteredCategoryTreatments = searchQuery.trim() 
              ? categoryTreatments.filter(treatment => {
                  const normalizeString = (str: string) => 
                    str.toLowerCase()
                       .normalize('NFD')
                       .replace(/[\u0300-\u036f]/g, '')
                       .trim()
                  return normalizeString(treatment.name).includes(
                    normalizeString(searchQuery)
                  )
                })
              : categoryTreatments

            return (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {filteredCategoryTreatments.length} tratamentos em {config.label}
                  </span>
                  {filteredCategoryTreatments.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectAllInCategory(category as TreatmentCategory)}
                      disabled={disabled || filteredCategoryTreatments.every(t => value.includes(t.id))}
                    >
                      Selecionar Todos
                    </Button>
                  )}
                </div>
                <TreatmentList 
                  treatments={filteredCategoryTreatments}
                  selectedIds={value}
                  onToggle={toggleTreatment}
                  loading={loading}
                  searchQuery={searchQuery}
                  disabled={disabled}
                  maxHeight={maxHeight}
                  state={state}
                />
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Componente auxiliar para listar tratamentos
interface TreatmentListProps {
  treatments: Treatment[]
  selectedIds: string[]
  onToggle: (id: string) => void
  loading: boolean
  searchQuery: string
  disabled: boolean
  maxHeight: string
  state?: string
}

// Componente memoizado para evitar re-renders desnecessários
const TreatmentItem = React.memo(({ 
  treatment, 
  isSelected, 
  onToggle, 
  disabled,
  state
}: {
  treatment: Treatment
  isSelected: boolean
  onToggle: (id: string) => void
  disabled: boolean
  state?: string
}) => {
  const config = CATEGORY_CONFIG[treatment.category]
  const Icon = config.icon

  // Handler memoizado para evitar re-criação
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onToggle(treatment.id)
    }
  }, [treatment.id, onToggle, disabled])

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200",
        "hover:bg-muted/50 hover:border-primary/50",
        isSelected && "bg-primary/5 border-primary/50 shadow-sm",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleToggle}
    >
      <div className="flex items-center space-x-3 flex-1">
        {/* Removendo o Checkbox completamente para eliminar o loop */}
        <div 
          className={cn(
            "w-4 h-4 border-2 rounded flex items-center justify-center transition-colors",
            isSelected 
              ? "bg-primary border-primary text-primary-foreground" 
              : "border-input bg-background"
          )}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1">
          <span className="text-sm font-medium">{treatment.name}</span>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={cn("text-xs", config.color)}>
              {config.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {state && treatment.state_prices.find(statePrice => statePrice.state === state) ? 
                `R$ ${formatCurrency(treatment.state_prices.find(statePrice => statePrice.state === state)?.price || 0)}`
                : `R$ ${formatCurrency(treatment.price)}`
              }
            </span>
          </div>
        </div>
      </div>
      {isSelected && (
        <Check className="h-4 w-4 text-primary flex-shrink-0" />
      )}
    </div>
  )
})

TreatmentItem.displayName = 'TreatmentItem'

function TreatmentList({ 
  treatments, 
  selectedIds, 
  onToggle, 
  loading, 
  searchQuery, 
  disabled,
  maxHeight,
  state
}: TreatmentListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
        Carregando tratamentos...
      </div>
    )
  }

  if (treatments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Search className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">
          {searchQuery ? 
            `Nenhum tratamento encontrado para "${searchQuery}"` : 
            "Nenhum tratamento disponível"
          }
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxHeight, overflowY: 'auto' }}>
      <div className="space-y-2 pr-4">
        {treatments.map((treatment) => {
          const isSelected = selectedIds.includes(treatment.id)
          
          return (
            <TreatmentItem
              key={treatment.id}
              treatment={treatment}
              isSelected={isSelected}
              onToggle={onToggle}
              disabled={disabled}
              state={state}
            />
          )
        })}
      </div>
    </div>
  )
}

