'use server'

import type { Form } from "@/types/entities/form"
import { apiClient } from "../client"
import { revalidateTag } from "next/cache"

const BASE_PATH = "/forms"

type CreateFormProps = {
  name: string
  treatment_ids: string[]
  external_form_id: string
}
type UpdateFormProps = {
  form_id: string
  name: string
  external_form_id?: string
  treatment_ids: string[]
}

export const getFormsAction = async () => {
  const forms = await apiClient.get<Form[]>(BASE_PATH, { tags: ["forms"] })

  return forms
}

export const createFormAction = async (props: CreateFormProps) => {
  await apiClient.post<void>(BASE_PATH, props)

  revalidateTag("forms")
}
export const updateFormAction = async (props: UpdateFormProps) => {
  await apiClient.patch<void>(`${BASE_PATH}/${props.form_id}`, {
    name: props.name,
    external_form_id: props.external_form_id,
    treatment_ids: props.treatment_ids
  })

  revalidateTag("forms")
}

export const deleteFormAction = async (form_id: string) => {
  await apiClient.delete<void>(`${BASE_PATH}/${form_id}`)

  revalidateTag("forms")
}