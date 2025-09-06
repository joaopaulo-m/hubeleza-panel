'use server'

import type { Admin } from "@/types/entities/admin"
import { apiClient } from "../client"

const BASE_PATH = "/admins"

export const getAdmin = async () => {
  const admin = await apiClient.get<Admin>(`${BASE_PATH}/me`, { tags: ["admin"] })

  return admin
}