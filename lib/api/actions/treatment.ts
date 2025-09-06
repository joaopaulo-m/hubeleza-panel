'use server'

import { revalidateTag } from "next/cache"

import { apiClient } from "../client"
import type { Treatment } from "@/types/entities/treatment"

const BASE_PATH = "/treatments"

interface CreateTreatmentProps {
  name: string
  price: number
  category: string
  state_prices: { state: string, price: number }[]
}

interface UpdateTreatmentProps {
  treatment_id: string
  name: string
}

interface GetTreatmentsProps {
  name?: string
  category?: string
}

export const getTreatmentsAction = async (props?: GetTreatmentsProps) => {
  const query = new URLSearchParams();

  if (props) {
    if (props.name) query.append("name", props.name);
    if (props.category) query.append("category", props.category);
  }

  const queryString = query.toString();
  const url = `${BASE_PATH}${queryString ? `?${queryString}` : ""}`;

  const treatments = await apiClient.get<Treatment[]>(url, { tags: ["treatments"] })

  return treatments
}

export const createTreatmentAction = async (props: CreateTreatmentProps) => {
  await apiClient.post<void>(BASE_PATH, {
    name: props.name,
    price: props.price,
    category: props.category,
    state_prices: props.state_prices
  })

  revalidateTag("treatments")
}

export const updateTreatmentAction = async (props: UpdateTreatmentProps) => {
  await apiClient.patch<void>(`${BASE_PATH}/${props.treatment_id}`, {
    name: props.name
  })

  revalidateTag("treatments")
}

export const deleteTreatmentAction = async (treatment_id: string) => {
  await apiClient.delete<void>(`${BASE_PATH}/${treatment_id}`)

  revalidateTag("treatments")
}