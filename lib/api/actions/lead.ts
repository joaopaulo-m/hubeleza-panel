'use server'

import type { Lead } from "@/types/entities/lead"
import { apiClient } from "../client"

const BASE_PATH = "/leads"

export interface GetCurrentPartnerLeadsProps {
  name?: string
  start_date?: string
  end_date?: string
  page?: string
  treatment_ids?: string
}

export const getCurrentPartnerLeadsAction = async (props: GetCurrentPartnerLeadsProps): Promise<{
  data: Lead[];
  total: number;
  totalPages: number;
}> => {
  console.log(props)
  const query = new URLSearchParams();

  if (props.name) query.append("name", props.name);
  if (props.start_date) query.append("start_date", props.start_date);
  if (props.end_date) query.append("end_date", props.end_date);
  if (props.page) query.append("page", props.page);
  if (props.treatment_ids) query.append("treatment_ids", props.treatment_ids);

  const queryString = query.toString();
  const url = `${BASE_PATH}/partner${queryString ? `?${queryString}` : ""}`;

  const { data, total, total_pages } = await apiClient.get<{ data: Lead[], total: number, total_pages: number }>(url, {
    tags: ["partner-leads"],
  });

  return {
    data,
    total,
    totalPages: total_pages
  };
};

export const getPartnerLeadsAction = async (id: string) => {
  const { data } = await apiClient.get<{ data: Lead[], total: number, total_pages: number }>(`${BASE_PATH}/partner/${id}`, {
    tags: ["partner-details-lead"],
  });

  return data
};