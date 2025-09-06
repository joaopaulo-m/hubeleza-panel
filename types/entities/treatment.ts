import type { TreatmentCategory } from "../enums/treatment-category"
import type { TreatmentStatePrice } from "./treatment-state-price"

export type Treatment = {
  id: string
  name: string
  category: TreatmentCategory
  price: number
  state_prices: TreatmentStatePrice[]
}