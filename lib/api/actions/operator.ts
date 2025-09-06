'use server'

import { revalidateTag } from "next/cache";
import { apiClient } from "../client"
import type { Operator } from "@/types/entities/operator";

interface CreateOperatorProps {
  name: string
  email: string
}

interface UpdateOperatorProps {
  operator_id: string
  name: string
  email: string
}

const BASE_PATH = "/operators"

export const getOperatorsAction = async () => {
  const operators = await apiClient.get<Operator[]>(BASE_PATH, {
    tags: ["operators"],
  });

  return operators
};

export const createOperatorAction = async (props: CreateOperatorProps) => {
  await apiClient.post<void>(BASE_PATH, {
    name: props.name,
    email: props.email
  })

  revalidateTag('operators')
}

export const updateOperatorAction = async (props: UpdateOperatorProps) => {
  await apiClient.patch<void>(`${BASE_PATH}/${props.operator_id}`, {
    name: props.name,
    email: props.email
  })

  revalidateTag('operators')
}

export const deleteOperatorAction = async (operator_id: string) => {
  await apiClient.delete<void>(`${BASE_PATH}/${operator_id}`)

  revalidateTag('operators')
}