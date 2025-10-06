import type { AffiliateStatus } from "../enums/affiliate-status"

export interface Affiliate {
  id: string
  name: string
  email: string
  password: string
  created_at: number
  status: AffiliateStatus
  comission_percentage: number
  lead_comission_amount?: number
  referral_code: string
  password_not_defined?: boolean
}