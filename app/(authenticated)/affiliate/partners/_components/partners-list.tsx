import { getPartnersAction } from "@/lib/api/actions/partner"
import { AffiliatePartnerItem } from "./partner-item"

interface AffiliatePartnersListProps {
  name?: string
  startDate?: string
  endDate?: string
}

export async function AffiliatePartnersList(props: AffiliatePartnersListProps) {
  const partners = await getPartnersAction({
    name: props.name,
    start_date: props.startDate,
    end_date: props.endDate
  })

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {partners.map(partner => (
        <AffiliatePartnerItem key={partner.id} partner={partner} />
      ))}
    </tbody>
  )
}