import type { Treatment } from "./treatment"

export interface Lead {
  id: string
  name: string
  phone_number: string
  cep: string
  created_at: number
  treatments: Treatment[]
}