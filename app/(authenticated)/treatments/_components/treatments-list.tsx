import { getTreatmentsAction } from "@/lib/api/actions/treatment"
import { TreatmentItem } from "./treatment-item"

interface TreatmentsListProps {
  name?: string
  category?: string
}

export async function TreatmentsList(props: TreatmentsListProps) {
  const treatments = await getTreatmentsAction(props)

  return (
    <>
      {treatments.map((treatment) => (
        <TreatmentItem
          key={treatment.id}
          treatment={treatment}
        />
      ))}
    </>
  )
}