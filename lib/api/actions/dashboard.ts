'use server'

import type { Dashboard, TreatmentData } from "@/types/entities/dashboard"
import { apiClient } from "../client"

export interface PartnerDashboardData {
  total_leads: number
  total_treatments: number
  leads_per_treatment: { treatment: string, count: number }[]
}

export interface AdminDashboardData {
  total_wallet_balance: number
  total_payment_gateway_balance: number
  total_partners: number
  total_leads_sent: number
  top_treatments: { name: string, total_leads: number }[]
  top_partners_by_leads: { partner_name: string, total_leads: number }[]
  top_partners_by_deposit: { partner_name: string, total_deposit: number }[]
}

export interface OperatorDashboardData {
  sign_up_comission_amount: number
  topup_comission_amount: number
  total_partners: number
}

export interface AffiliateDashboardData {
  total_comission_amount: number
  total_withdraw_amount: number
  total_partners: number
}

interface TransactionsDashboardData {
  total_transactions: number
  total_amount: number
  total_credit: number
  total_debit: number
  monthly_growth: number
  pending_transactions: number,
  completed_transactions: number
  failed_transactions: number
}

const BASE_PATH = "/dashboards"

export const getAdminDashboardDataAction = async () => {
  const dashboard = await apiClient.get<AdminDashboardData>(BASE_PATH, { 
    tags: ["dashboard"],
    revalidate: 5
  })

  return dashboard
}

export const getTreatmentDataAction = async (treatment_id: string) => {
  const dashboard = await apiClient.get<TreatmentData>(`${BASE_PATH}/treatments/${treatment_id}`, { 
    tags: ["treatment-data"],
    revalidate: 5
  })

  return dashboard
}

export const getPartnerDashboardDataAction = async () => {
  const dashboard = await apiClient.get<PartnerDashboardData>(`${BASE_PATH}/partners`, { 
    tags: ["partner-dashboard"],
    revalidate: 5
  })

  return dashboard
}

export const getOperatorDashboardDataAction = async () => {
  const dashboard = await apiClient.get<OperatorDashboardData>(`${BASE_PATH}/operators`, { 
    tags: ["operator-dashboard"],
    revalidate: 8
  })

  return dashboard
}

export const getAffiliateDashboardDataAction = async () => {
  const dashboard = await apiClient.get<AffiliateDashboardData>(`${BASE_PATH}/affiliates`, { 
    tags: ["affiliate-dashboard"],
    revalidate: 8
  })

  return dashboard
}

export const getTransactionsDashboardDataAction = async (props: { start_date?: string, end_date?: string }) => {
  const query = new URLSearchParams();

  if (props) {
    if (props.start_date) query.append("start_date", props.start_date);
    if (props.end_date) query.append("end_date", props.end_date);
  }

  const queryString = query.toString();
  const url = `${BASE_PATH}/transactions${queryString ? `?${queryString}` : ""}`;

  const dashboard = await apiClient.get<TransactionsDashboardData>(url, { 
    tags: ["transactions-dashboard"],
    revalidate: 5
  })

  return dashboard
}