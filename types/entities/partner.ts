import type { PartnerStatus } from "../enums/partner-status"
import type { Treatment } from "./treatment"

export type Partner = {
  id: string
  status: PartnerStatus
  name: string
  company_name: string
  cpf: string
  cnpj?: string
  email: string
  created_at: number;
  phone_number: string
  cep: string
  city: string
  state: string
  lat: string
  lng: string
  treatments: Treatment[]
  password_not_defined: boolean
}