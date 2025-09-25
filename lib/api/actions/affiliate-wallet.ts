'use server'

import { apiClient } from "../client"
import type { AffiliateWallet } from "@/types/entities/affiliate-wallet";

const BASE_PATH = "/affiliate-wallets"

export const getAffiliateWalletAction = async () => {
  const affiliateWallet = await apiClient.get<AffiliateWallet>(`${BASE_PATH}/me`, {
    tags: ["affiliate-wallet"],
    revalidate: 8
  });

  return affiliateWallet
};