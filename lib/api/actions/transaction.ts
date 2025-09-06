'use server'

import { apiClient } from "../client"
import type { Transaction } from "@/types/entities/transaction"

const BASE_PATH = "/transactions"

export const getTransactionByIdAction = async (transaction_id: string) => {
  const result = await apiClient.get<Transaction>(`${BASE_PATH}/${transaction_id}`)

  return result
}

export const getTransactionsAction = async () => {
  const result = await apiClient.get<Transaction[]>(`${BASE_PATH}/partners/me`, { revalidate: 6 })

  return result
}

export const getTransactionsByPartnerIdAction = async (partner_id: string) => {
  const result = await apiClient.get<Transaction[]>(`${BASE_PATH}/partners/${partner_id}/list`, { revalidate: 6 })

  return result
}
