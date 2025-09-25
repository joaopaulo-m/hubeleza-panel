import { apiClient } from "../client"
import type { AffiliateTransaction } from "@/types/entities/affiliate-transaction"

interface GetAffiliateTransactionsProps {
  name?: string
  type?: string
  start_date?: string
  end_date?: string
}

const BASE_PATH = "/affiliate-transactions"

export const getAffiliateTransactionsAction = async (props: GetAffiliateTransactionsProps) => {
  const query = new URLSearchParams();

  if (props.name) query.append("partner_name", props.name);
  if (props.type) query.append("type", props.type);
  if (props.start_date) query.append("start_date", props.start_date);
  if (props.end_date) query.append("end_date", props.end_date);

  const queryString = query.toString();
  const url = `${BASE_PATH}${queryString ? `?${queryString}` : ""}`;

  return await apiClient.get<AffiliateTransaction[]>(url, {
    revalidate: 8
  });
}