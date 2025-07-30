import type { Treatment } from "./treatment"

export type Partner = {
  id: string
  name: string
  phone_number: string
  cep: string
  lat: string
  lng: string
  treatments: Treatment[]
}