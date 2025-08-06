import * as React from "react"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, 'value' | 'onChange'> {
  value?: number // valor em centavos
  onChange?: (valueInCents: number) => void
}

function CurrencyInput({ className, value, onChange, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState("")

  // Formatar valor em centavos para display (R$ 1.234,56)
  const formatCurrency = (valueInCents: number): string => {
    if (valueInCents === 0) return ""
    
    const valueInReais = valueInCents / 100
    return valueInReais.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Converter string formatada para centavos
  const parseCurrency = (formattedValue: string): number => {
    if (!formattedValue) return 0
    
    // Remove todos os caracteres exceto números
    const numbersOnly = formattedValue.replace(/\D/g, '')
    
    // Se não há números, retorna 0
    if (!numbersOnly) return 0
    
    // Converte para número (já em centavos)
    return parseInt(numbersOnly, 10)
  }

  // Aplicar máscara durante a digitação
  const applyMask = (inputValue: string): string => {
    // Remove todos os caracteres não numéricos
    const numbersOnly = inputValue.replace(/\D/g, '')
    
    if (!numbersOnly) return ""
    
    // Converte para centavos
    const valueInCents = parseInt(numbersOnly, 10)
    
    // Formata como moeda
    return formatCurrency(valueInCents)
  }

  // Atualiza display quando value prop muda
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatCurrency(value))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const maskedValue = applyMask(inputValue)
    const valueInCents = parseCurrency(maskedValue)
    
    setDisplayValue(maskedValue)
    
    if (onChange) {
      onChange(valueInCents)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas números, backspace, delete, tab, escape, enter, arrows
    if (
      ![8, 9, 27, 13, 37, 39, 46, 16, 17, 18].includes(e.keyCode) &&
      (e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault()
    }
  }

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={props.placeholder || "R$ 0,00"}
    />
  )
}

export { CurrencyInput }