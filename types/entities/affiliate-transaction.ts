export interface AffiliateTransaction {
  id: string
  affiliate_wallet_id: string
  type: string
  amount: number
  created_at: number
  comission_percentage?: number
  partner_id?: string
  lead_id?: string
  lead_price?: number
  lead_comission_amount?: number
}