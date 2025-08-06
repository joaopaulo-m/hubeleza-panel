import type { Treatment } from "./treatment"

export type Form = {
  id: string
  name: string
  external_form_id: string
  treatments: Treatment[]
}