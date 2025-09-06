import { Activity, Users, FileText, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

// Importações dos componentes necessários
import type { Treatment } from "@/types/entities/treatment"
import { TreatmentCategory } from "@/types/enums/treatment-category"
import { EditTreatmentForm } from "./edit-treatment-form"
import { TreatmentItemOptions } from "./treatment-item-options"
import { getTreatmentDataAction } from "@/lib/api/actions/dashboard"
import { TreatmentDetailsDialog } from "./treatment-details-dialog"

// Configuração das categorias com ícones e cores
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

export interface TreatmentItemProps {
  treatment: Treatment
}

export const TreatmentItem = async (props: TreatmentItemProps) => {
  const { treatment } = props
  const treatmentData = await getTreatmentDataAction(treatment.id)
  
  const categoryConfig = CATEGORY_CONFIG[treatment.category]
  const CategoryIcon = categoryConfig.icon
  
  // Calcular estatísticas dos preços por estado (função pura para Server Component)
  const calculatePriceStats = (basePrice: number, statePrices: Array<{ price: number }>) => {
    if (statePrices.length === 0) {
      return {
        hasVariations: false,
        minPrice: basePrice,
        maxPrice: basePrice,
        statesWithCustomPrices: 0,
        priceRange: 0
      }
    }

    const allPrices = [basePrice, ...statePrices.map(sp => sp.price)]
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    
    return {
      hasVariations: minPrice !== maxPrice,
      minPrice,
      maxPrice,
      statesWithCustomPrices: statePrices.length,
      priceRange: ((maxPrice - minPrice) / minPrice) * 100
    }
  }
  
  const priceStats = calculatePriceStats(treatment.price, treatment.state_prices)

  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          {/* Minimal Icon */}
          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
            <CategoryIcon className="w-6 h-6 text-gray-600" />
          </div>
          
          <div className="flex items-center gap-3">
            {/* Simple Category Badge */}
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">
              {categoryConfig.label}
            </Badge>
            <TreatmentItemOptions treatment_id={treatment.id} />
          </div>
        </div>
        
        {/* Treatment Name */}
        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {treatment.name}
          </h3>
          
          {/* Price Information */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-500">Preço base</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(treatment.price)}
            </span>
          </div>
          
          {/* State Price Variations - Minimal */}
          {priceStats.hasVariations && (
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>{priceStats.statesWithCustomPrices} estados personalizados</span>
                <span className="font-medium">
                  {formatCurrency(priceStats.minPrice)} - {formatCurrency(priceStats.maxPrice)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="h-px bg-gray-100" />
        
        {/* Minimal Statistics */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Formulários</span>
            <span className="font-medium text-gray-900">{treatmentData.form_count}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Parceiros</span>
            <span className="font-medium text-gray-900">{treatmentData.partner_count}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Leads</span>
            <span className="font-medium text-gray-900">{treatmentData.lead_count}</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />
        
        {/* Minimal Action Buttons */}
        <div className="flex gap-2">
          <TreatmentDetailsDialog 
            name={treatment.name}
            data={treatmentData}
            treatment={treatment}
          />
          <EditTreatmentForm treatment={treatment} />
        </div>
      </CardContent>
    </Card>
  )
}