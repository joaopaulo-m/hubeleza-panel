'use server'

import { revalidateTag } from "next/cache";

import { apiClient } from "../client"
import type { Affiliate } from "@/types/entities/affiliate";

interface CreateAffiliateProps {
  name: string
  email: string
  document: string
  referral_code: string,
  comission_percentage: number
  lead_comission_amount: number
}

interface UpdateAffiliateProps {
  affiliate_id: string
  name: string
  referral_code: string
  comission_percentage: number
  lead_comission_amount: number
}

interface GetAffiliatesProps {
  name?: string
  referral_code?: string
}

const BASE_PATH = "/affiliates"

export const getAffiliateById = async (affiliate_id: string) => {
  const affiliate = await apiClient.get<Affiliate>(`${BASE_PATH}/${affiliate_id}/id`);

  return affiliate
};

export const getAffiliate = async () => {
  const affiliate = await apiClient.get<Affiliate>(`${BASE_PATH}/me`);

  return affiliate
};

export const getAffiliatesAction = async (props: GetAffiliatesProps) => {
  const query = new URLSearchParams();

  if (props.name) query.append("name", props.name);
  if (props.referral_code) query.append("referral_code", props.referral_code);

  const queryString = query.toString();
  const url = `${BASE_PATH}${queryString ? `?${queryString}` : ""}`;

  return await apiClient.get<Affiliate[]>(url, {
    revalidate: 8,
    tags: ['affiliates']
  });
}

export const createAffiliateAction = async (props: CreateAffiliateProps) => {
  await apiClient.post<void>(BASE_PATH, {
    name: props.name,
    email: props.email,
    document: props.document,
    comission_percentage: props.comission_percentage,
    referral_code: props.referral_code,
    lead_comission_amount: props.lead_comission_amount
  })

  revalidateTag('affiliates')
}

export const updateAffiliateAction = async (props: UpdateAffiliateProps) => {
  await apiClient.patch<void>(`${BASE_PATH}/${props.affiliate_id}`, {
    name: props.name,
    referral_code: props.referral_code,
    comission_percentage: props.comission_percentage,
    lead_comission_amount: props.lead_comission_amount
  })

  revalidateTag('affiliates')
}

export const deleteAffiliateAction = async (affiliate_id: string) => {
  await apiClient.delete<void>(`${BASE_PATH}/${affiliate_id}`);
  
  revalidateTag('affiliates')
};