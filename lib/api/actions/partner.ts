'use server'

import { revalidateTag } from "next/cache"

import type { Partner } from "@/types/entities/partner"
import { apiClient } from "../client"

const BASE_PATH = "/partners"

interface CreatePartnerProps {
  name: string
  phone_number: string
  cep: string
  treatment_ids: string[]
}

interface UpdatePartnerProps {
  partner_id: string
  name: string
  phone_number: string
  cep: string
  treatment_ids: string[]
}

export const getPartnersAction = async () => {
  const partners = await apiClient.get<Partner[]>(BASE_PATH, { tags: ["partners"] })

  return partners
}

export const createPartnerAction = async (props: CreatePartnerProps) => {
  await apiClient.post<void>(BASE_PATH, {
    name: props.name,
    phone_number: props.phone_number,
    cep: props.cep,
    treatment_ids: props.treatment_ids
  })

  revalidateTag("partners")
}

export const updatePartnerAction = async (props: UpdatePartnerProps) => {
  await apiClient.patch<void>(`${BASE_PATH}/${props.partner_id}`, {
    name: props.name,
    phone_number: props.phone_number,
    cep: props.cep,
    treatment_ids: props.treatment_ids
  })

  revalidateTag("partners")
}

export const deletePartnerAction = async (partner_id: string) => {
  await apiClient.delete<void>(`${BASE_PATH}/${partner_id}`)

  revalidateTag("partners")
}