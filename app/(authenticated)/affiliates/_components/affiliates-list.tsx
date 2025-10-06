import { getAffiliatesAction } from "@/lib/api/actions/affiliate"
import { AffiliateItem } from "./affiliate-item"

interface AffiliatesListProps {
  name?: string
  status?: string
  referralCode?: string
}

export async function AffiliatesList(props: AffiliatesListProps) {
  const affiliates = await getAffiliatesAction(props)

  return (
    <>
      {affiliates.map(affiliate => (
        <AffiliateItem key={affiliate.id} affiliate={affiliate} />
      ))}
    </>
  )
}