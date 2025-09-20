'use server'

import type { OperatorWallet } from "@/types/entities/operator-wallet";
import { apiClient } from "../client"

const BASE_PATH = "/operator-wallets"

export const getOperatorWalletAction = async () => {
  const operatorWallet = await apiClient.get<OperatorWallet>(BASE_PATH, {
    tags: ["operator-wallet"],
    revalidate: 8
  });

  return operatorWallet
};