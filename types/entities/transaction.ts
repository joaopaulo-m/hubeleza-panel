import type { Lead } from "./lead"

export interface Transaction {
  id: string
  wallet_id: string
  status: string
  type: string
  amount: number
  created_at: number
  lead_price?: number
  lead?: Lead
  bonus_amount?: number
}