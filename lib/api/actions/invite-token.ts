'use server'

import { revalidateTag } from "next/cache"

import { apiClient } from "../client"
import type { InviteToken } from "@/types/entities/invite-token"

const BASE_PATH = "/invite-tokens"

type GetInviteTokensProps = {
  name?: string
  start_date?: string
  end_date?: string
}

export const getInviteTokens = async (props?: GetInviteTokensProps) => {
  const query = new URLSearchParams();

  if (props) {
    if (props.name) query.append("name", props.name);
    if (props.start_date) query.append("start_date", props.start_date);
    if (props.end_date) query.append("end_date", props.end_date);
  }

  const queryString = query.toString();
  const url = `${BASE_PATH}${queryString ? `?${queryString}` : ""}`;

  const inviteTokens = await apiClient.get<InviteToken[]>(url, { tags: ["invite-tokens"] })

  return inviteTokens
}

export const getInviteTokenByTokenAction = async (token: string) => {
  const inviteToken = await apiClient.get<InviteToken>(`${BASE_PATH}/tokens/${token}`, { tags: ["invite-token"] })

  return inviteToken
}

export const createInviteToken = async ({ name, phone_number }: { name: string, phone_number: string}) => {
  await apiClient.post<void>(BASE_PATH, {
    name,
    phone_number
  })

  revalidateTag("invite-tokens")
}

export const deleteInviteToken = async (id: string) => {
  await apiClient.delete<void>(`${BASE_PATH}/${id}`)

  revalidateTag("invite-tokens")
}