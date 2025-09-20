import type { OperatorTransaction } from "./operator-transaction"

export interface OperatorWallet {
  id: string
  operator_id: string
  document: string
  balance: number
  external_id?: string
  transactions: OperatorTransaction[]
}