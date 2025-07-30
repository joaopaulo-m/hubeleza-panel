'use server'

import type { Dashboard, TreatmentData } from "@/types/entities/dashboard"
import { apiClient } from "../client"

const BASE_PATH = "/dashboards"

export const getDashboardDataAction = async () => {
  const dashboard = await apiClient.get<Dashboard>(BASE_PATH, { 
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