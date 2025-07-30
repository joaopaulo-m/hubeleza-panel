'use server'

import { revalidateTag } from "next/cache"

import { apiClient } from "../client"
import type { Treatment } from "@/types/entities/treatment"

const BASE_PATH = "/treatments"

interface CreateTreatmentProps {
  name: string
}

interface UpdateTreatmentProps {
  treatment_id: string
  name: string
}

export const getTreatmentsAction = async () => {
  const treatments = await apiClient.get<Treatment[]>(BASE_PATH, { tags: ["treatments"] })

  return treatments
}

export const createTreatmentAction = async (props: CreateTreatmentProps) => {
  await apiClient.post<void>(BASE_PATH, {
    name: props.name
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