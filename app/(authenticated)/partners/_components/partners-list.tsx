import { getPartnersAction } from "@/lib/api/actions/partner"
import { PartnerItem } from "./partner-item"

interface PartnersListProps {
  name?: string
  city?: string
  state?: string
  status?: string
  startDate?: string
  endDate?: string
  treatment_ids?: string
}

export async function PartnersList(props: PartnersListProps) {
  const partners = await getPartnersAction({
    ...props,
    start_date: props.startDate,
    end_date: props.endDate
  })

  return (
    <>
      {partners.map((partner) => (
        <PartnerItem 
          key={partner.id}
          partner={partner}
        />
      ))}
    </>
  )
}