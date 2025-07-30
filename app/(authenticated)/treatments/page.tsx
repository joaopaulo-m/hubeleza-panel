import { getTreatmentsAction } from "@/lib/api/actions/treatment";
import { TreatmentItem } from "./_components/treatment-item";
import { CreateTreatmentForm } from "./_components/create-treatment-form";

export const dynamic = "force-dynamic";

export default async function TreatmentsPage() {
  const treatments = await getTreatmentsAction()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tratamentos</h1>
        <CreateTreatmentForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treatments.map((treatment) => (
          <TreatmentItem 
            key={treatment.id}
            treatment={treatment}
          />
        ))}
      </div>
    </div>
  )
}