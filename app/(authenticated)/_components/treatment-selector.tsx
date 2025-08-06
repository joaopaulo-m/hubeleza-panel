import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import type { Treatment } from "@/types/entities/treatment"
import { getTreatmentsAction } from "@/lib/api/actions/treatment"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TreatmentSelectorProps {
  value: string[] // Array de IDs dos tratamentos selecionados
  onChange: (value: string[]) => void // Callback para mudanças
  placeholder?: string
  disabled?: boolean
  className?: string
  preloadedTreatments?: Treatment[] // Para evitar fetch desnecessários
}

export function TreatmentSelector({
  value = [],
  onChange,
  placeholder = "Selecione tratamentos",
  disabled = false,
  className,
  preloadedTreatments
}: TreatmentSelectorProps) {
  const [treatments, setTreatments] = useState<Treatment[]>(preloadedTreatments || [])
  const [loading, setLoading] = useState(!preloadedTreatments)
  const [open, setOpen] = useState(false)

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

  // Função para alternar seleção de um tratamento
  const toggleTreatment = (treatmentId: string) => {
    const newValue = value.includes(treatmentId)
      ? value.filter(id => id !== treatmentId)
      : [...value, treatmentId]
    
    onChange(newValue)
  }

  // Função para obter nomes dos tratamentos selecionados
  const getSelectedTreatmentsText = () => {
    if (value.length === 0) return placeholder
    if (value.length === 1) {
      const treatment = treatments.find(t => t.id === value[0])
      return treatment?.name || "1 tratamento selecionado"
    }
    return `${value.length} tratamentos selecionados`
  }

  // Função para limpar todas as seleções
  const clearAll = () => {
    onChange([])
  }

  // Função para selecionar todos
  const selectAll = () => {
    onChange(treatments.map(t => t.id))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            value.length === 0 && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">{getSelectedTreatmentsText()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="text-sm font-medium">Tratamentos</span>
          <div className="flex gap-2">
            {value.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-8 px-2 text-xs"
              >
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="h-8 px-2 text-xs"
              disabled={treatments.length === value.length}
            >
              Todos
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Carregando tratamentos...
          </div>
        ) : treatments.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhum tratamento encontrado
          </div>
        ) : (
          <ScrollArea className="h-48">
            <div className="p-1">
              {treatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                    value.includes(treatment.id) && "bg-muted"
                  )}
                  onClick={() => toggleTreatment(treatment.id)}
                >
                  <Checkbox
                    id={treatment.id}
                    checked={value.includes(treatment.id)}
                    onChange={() => {}} // Controlado pelo onClick do container
                    className="pointer-events-none"
                  />
                  <label
                    htmlFor={treatment.id}
                    className="text-sm flex-1 cursor-pointer select-none"
                  >
                    {treatment.name}
                  </label>
                  {value.includes(treatment.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {value.length > 0 && (
          <div className="border-t px-3 py-2 text-xs text-muted-foreground">
            {value.length} de {treatments.length} selecionados
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}