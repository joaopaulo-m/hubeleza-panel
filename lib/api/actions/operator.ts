'use server'

import { revalidateTag } from "next/cache";
import { apiClient } from "../client"
import type { Operator } from "@/types/entities/operator";
import type { OperatorTransaction } from "@/types/entities/operator-transaction";

interface CreateOperatorProps {
  name: string
  email: string
  document: string
  sign_up_comission_percentage?: number,
  topup_comission_percentage?: number
}

interface UpdateOperatorProps {
  operator_id: string
  name: string
  email: string,
  sign_up_comission_percentage?: number
  topup_comission_percentage?: number
}

interface GetOperatorTransactionsProps {
  partner_name?: string
  type?: string
  start_date?: string
  end_date?: string
}

const BASE_PATH = "/operators"

export const getOperatorsAction = async () => {
  const operators = await apiClient.get<Operator[]>(BASE_PATH, {
    tags: ["operators"],
  });

  return operators
};

export const getOperatorById = async (operator_id: string) => {
  const operator = await apiClient.get<Operator>(`${BASE_PATH}/${operator_id}/id`);

  return operator
};

export const getOperator = async () => {
  const operator = await apiClient.get<Operator>(`${BASE_PATH}/me`);

  return operator
}

export const getOperatorTransactionsAction = async (props: GetOperatorTransactionsProps) => {
  const query = new URLSearchParams();

  if (props.partner_name) query.append("partner_name", props.partner_name);
  if (props.type) query.append("type", props.type);
  if (props.start_date) query.append("start_date", props.start_date);
  if (props.end_date) query.append("end_date", props.end_date);

  const queryString = query.toString();
  const url = `${BASE_PATH}/transactions${queryString ? `?${queryString}` : ""}`;

  return await apiClient.get<OperatorTransaction[]>(url, {
    revalidate: 8
  });
}

export const createOperatorAction = async (props: CreateOperatorProps) => {
  await apiClient.post<void>(BASE_PATH, {
    name: props.name,
    email: props.email,
    document: props.document,
    sign_up_comission_percentage: props.sign_up_comission_percentage,
    topup_comission_percentage: props.topup_comission_percentage
  })

  revalidateTag('operators')
}

export const updateOperatorAction = async (props: UpdateOperatorProps) => {
  await apiClient.patch<void>(`${BASE_PATH}/${props.operator_id}`, {
    name: props.name,
    email: props.email,
    sign_up_comission_percentage: props.sign_up_comission_percentage,
    topup_comission_percentage: props.topup_comission_percentage
  })

  revalidateTag('operators')
}

export const deleteOperatorAction = async (operator_id: string) => {
  await apiClient.delete<void>(`${BASE_PATH}/${operator_id}`)

  revalidateTag('operators')
}