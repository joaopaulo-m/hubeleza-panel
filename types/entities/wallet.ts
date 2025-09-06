import type { Transaction } from "./transaction"

export interface Wallet {
  id: string
  partner_id: string
  balance: number
  transactions: Transaction[]
}