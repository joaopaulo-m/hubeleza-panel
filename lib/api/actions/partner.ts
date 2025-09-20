'use server'

import { revalidateTag } from "next/cache"

import type { Partner } from "@/types/entities/partner"
import { apiClient } from "../client"

const BASE_PATH = "/partners"

interface CreatePartnerProps {
  name: string
  company_name: string
  cpf: string
  cnpj?: string
  email: string
  phone_number: string
  cep: string
  city: string
  state: string
  treatment_ids: string[]
}

interface SignPartnerUpProps {
  invite_token: string
  name: string
  company_name: string
  cpf: string
  cnpj?: string
  email: string
  password: string
  phone_number: string
  cep: string 
  city: string
  state: string
  treatment_ids: string[]
}

export interface SignPartnerUpReturn {
  transaction_id: string
  qr_code: string
  pix_copy_paste_code: string
}

interface UpdatePartnerProps {
  partner_id: string
  name: string
  company_name: string
  cpf: string
  cnpj?: string
  email: string
  phone_number: string
  cep: string
  city: string
  state: string
  treatment_ids: string[]
}

interface GetPartnersProps {
  name?: string
  city?: string
  state?: string
  status?: string
  start_date?: string
  end_date?: string
  treatment_ids?: string
}

export const getPartnersAction = async (props: GetPartnersProps) => {
  const query = new URLSearchParams();

  if (props.name) query.append("name", props.name);
  if (props.city) query.append("city", props.city);
  if (props.state) query.append("state", props.state);
  if (props.status) query.append("status", props.status);
  if (props.start_date) query.append("start_date", props.start_date);
  if (props.end_date) query.append("end_date", props.end_date);
  if (props.treatment_ids) query.append("treatment_ids", props.treatment_ids);

  const queryString = query.toString();
  const url = `${BASE_PATH}${queryString ? `?${queryString}` : ""}`;

  const partners = await apiClient.get<Partner[]>(url, { tags: ["partners"] })

  return partners
}

export const exportPartnersAction = async (props: GetPartnersProps) => {
  const query = new URLSearchParams();

  if (props.name) query.append("name", props.name);
  if (props.city) query.append("city", props.city);
  if (props.state) query.append("state", props.state);
  if (props.status) query.append("status", props.status);
  if (props.start_date) query.append("start_date", props.start_date);
  if (props.end_date) query.append("end_date", props.end_date);
  if (props.treatment_ids) query.append("treatment_ids", props.treatment_ids);

  const queryString = query.toString();
  const url = `${BASE_PATH}/export/csv${queryString ? `?${queryString}` : ""}`;

  return await apiClient.download(url)
}

export const getPartner = async () => {
  const partner = await apiClient.get<Partner>(`${BASE_PATH}/refresh/me`, { tags: ["partner"] })

  return partner
}

export const getPartnerByIdAction = async (partner_id: string) => {
  const partner = await apiClient.get<Partner>(`${BASE_PATH}/${partner_id}`)

  return partner
}

export const getPartnerDetailsAction = async (id: string) => {
  const partner = await apiClient.get<Partner>(`${BASE_PATH}/${id}`, { tags: ["partner-details"] })

  return partner
}

export const createPartnerAction = async (props: CreatePartnerProps) => {
  await apiClient.post<void>(BASE_PATH, {
    name: props.name,
    company_name: props.company_name,
    cpf: props.cpf,
    cnpj: props.cnpj,
    email: props.email,
    phone_number: props.phone_number,
    cep: props.cep,
    city: props.city,
    state: props.state,
    treatment_ids: props.treatment_ids
  })

  revalidateTag("partners")
}

export const signPartnerUpAction = async (props: SignPartnerUpProps) => {
  const response = await apiClient.post<SignPartnerUpReturn>(`${BASE_PATH}/invite-tokens/${props.invite_token}`, {
    name: props.name,
    company_name: props.company_name,
    cpf: props.cpf,
    cnpj: props.cnpj,
    email: props.email,
    password: props.password,
    phone_number: props.phone_number,
    cep: props.cep,
    city: props.city,
    state: props.state,
    treatment_ids: props.treatment_ids
  })

  revalidateTag("partners")
  return response
}

export const updatePartnerAction = async (props: UpdatePartnerProps) => {
  await apiClient.patch<void>(`${BASE_PATH}/${props.partner_id}`, {
    name: props.name,
    company_name: props.company_name,
    email: props.email,
    cpf: props.cpf,
    cnpj: props.cnpj,
    phone_number: props.phone_number,
    cep: props.cep,
    city: props.city,
    state: props.state,
    treatment_ids: props.treatment_ids
  })

  revalidateTag("partners")
}

export const updatePartnerStatusAction = async ({ partner_id, status }: { partner_id: string, status: string }) => {
  await apiClient.patch<void>(`${BASE_PATH}/${partner_id}/status`, {
    status
  })

  revalidateTag("partners")
  revalidateTag("partner-details")
}

export const deletePartnerAction = async (partner_id: string) => {
  await apiClient.delete<void>(`${BASE_PATH}/${partner_id}`)

  revalidateTag("partners")
}