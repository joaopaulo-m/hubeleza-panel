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