'use server'

import { apiClient } from "../client"
import type { Transaction } from "@/types/entities/transaction"

interface GetTransactionsProps {
  partner_name?: string
  lead_name?: string
  type?: string
  status?: string
  min_amount?: string
  max_amount?: string
  start_date?: string
  end_date?: string
}

const BASE_PATH = "/transactions"

export const getTransactionByIdAction = async (transaction_id: string) => {
  const result = await apiClient.get<Transaction>(`${BASE_PATH}/${transaction_id}`)

  return result
}

export const getTransactionsAction = async (props?: GetTransactionsProps) => {
  const query = new URLSearchParams();

  if (props) {
    if (props.partner_name) query.append("partner_name", props.partner_name);
    if (props.lead_name) query.append("lead_name", props.lead_name);
    if (props.type) query.append("type", props.type);
    if (props.status) query.append("status", props.status);
    if (props.min_amount) query.append("min_amount", props.min_amount);
    if (props.max_amount) query.append("max_amount", props.max_amount);
    if (props.start_date) query.append("start_date", props.start_date);
    if (props.end_date) query.append("end_date", props.end_date);
  }

  const queryString = query.toString();
  const url = `${BASE_PATH}${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get<{ items: Transaction[], total_items: number, limit: number, page: number }>(url, { tags: ["transactions"], revalidate: 8 })

  return response
}

export const exportTransactionsAction = async (props: GetTransactionsProps) => {
  const query = new URLSearchParams();

  if (props.partner_name) query.append("partner_name", props.partner_name);
  if (props.lead_name) query.append("lead_name", props.lead_name);
  if (props.type) query.append("type", props.type);
  if (props.status) query.append("status", props.status);
  if (props.min_amount) query.append("min_amount", props.min_amount);
  if (props.max_amount) query.append("max_amount", props.max_amount);
  if (props.start_date) query.append("start_date", props.start_date);
  if (props.end_date) query.append("end_date", props.end_date);

  const queryString = query.toString();
  const url = `${BASE_PATH}/export/csv${queryString ? `?${queryString}` : ""}`;

  return await apiClient.download(url)
}

export const getPartnerTransactionsAction = async () => {
  const result = await apiClient.get<Transaction[]>(`${BASE_PATH}/partners/me`, { revalidate: 6 })

  return result
}

export const getTransactionsByPartnerIdAction = async (partner_id: string) => {
  const result = await apiClient.get<Transaction[]>(`${BASE_PATH}/partners/${partner_id}/list`, { revalidate: 6 })

  return result
}
