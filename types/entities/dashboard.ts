export type Dashboard = {
  total_leads: number
  active_partners: number
  total_forms: number
  conversion_rate: number
  recent_leads: RecentLead[]
  treatment_performance: TreatmentPerformance[]
}

export type TreatmentPerformance = {
  treatment: string
  total_leads: number
  total_partners: number
}

export type RecentLead = {
  name: string
  treatment: string
  phone_number: string
  status: 'Enviado' | 'Pendente'
  created_at: Date
}

export type TreatmentData = {
  form_count: number
  partner_count: number
  lead_count: number
}