export interface Affiliate {
  id: string
  name: string
  email: string
  password: string
  created_at: number
  comission_percentage: number
  referral_code: string
  password_not_defined?: boolean
}