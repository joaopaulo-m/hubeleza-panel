'use server'

import type { Wallet } from "@/types/entities/wallet"
import { apiClient } from "../client"
import { revalidateTag } from "next/cache"

const BASE_PATH = "/wallets"

export interface CreateWalletPaymentReturn {
  transaction_id: string
  qr_code: string
  pix_copy_paste_code: string
}

export interface CreateWalletPaymentActionReturn {
  success: boolean
  result?: CreateWalletPaymentReturn
}

export interface CreditWalletProps {
  wallet_id: string
  amount: number
}

export interface CreateWalletCreditPaymentProps {
  wallet_id: string
  amount: number
}

export const getWalletAction = async () => {
  const result = await apiClient.get<Wallet>(`${BASE_PATH}/me`, {
    tags: ["wallet"],
    revalidate: 120
  })

  return result
}

export const getPartnerWalletAction = async (id: string) => {
  const result = await apiClient.get<Wallet>(`${BASE_PATH}/partners/${id}`, {
    tags: ["wallet-details"],
    revalidate: 120
  })

  return result
}

export const createWalletPaymentAction = async (amount: number): Promise<CreateWalletPaymentActionReturn> => {
  try {
    const wallet = await getWalletAction()

    const result = await apiClient.post<CreateWalletPaymentReturn>(`${BASE_PATH}/${wallet.id}/payments`, {
      amount
    })

    revalidateTag("wallet")
    return {
      success: true,
      result
    }
  } catch (error) {
    console.error(error)

    return {
      success: false
    }
  }
}

export const createWalletCreditPaymentAction = async (props: CreateWalletCreditPaymentProps): Promise<CreateWalletPaymentActionReturn> => {
  try {
    const result = await apiClient.post<CreateWalletPaymentReturn>(`${BASE_PATH}/${props.wallet_id}/payments`, {
      amount: props.amount
    })

    revalidateTag("wallet-details")
    return {
      success: true,
      result
    }
  } catch (error) {
    console.error(error)

    return {
      success: false
    }
  }
}

export const creditWalletAction = async (props: CreditWalletProps) => {
  await apiClient.post<void>(`${BASE_PATH}/${props.wallet_id}/credit`, {
    amount: props.amount
  })

  revalidateTag("partner-details")
  revalidateTag("partner-details-lead")
  revalidateTag("wallet-details")
}

export async function revalidateWallet() {
  revalidateTag("wallet")
}