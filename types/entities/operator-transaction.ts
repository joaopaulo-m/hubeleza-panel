import type { TransactionType } from "../enums/transaction-type"

export interface OperatorTransaction {
  id: string
  operator_wallet_id: string
  type: TransactionType
  amount: number
  created_at: number
  external_id?: string
  comission_percentage?: number
  partner_id?: string
}