export interface Operator {
  id: string
  name: string
  email: string
  created_at: number
  created_by: string
  sign_up_comission_percentage?: number
  topup_comission_percentage?: number
}