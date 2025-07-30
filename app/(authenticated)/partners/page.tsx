import { getPartnersAction } from "@/lib/api/actions/partner";
import { PartnerItem } from "./_components/partner-item";
import { CreatePartnerForm } from "./_components/create-partner-form";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const partners = await getPartnersAction()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Parceiros</h1>
        <CreatePartnerForm />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Clínicas Parceiras</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {partners.map((partner) => (
            <PartnerItem 
              key={partner.id}
              partner={partner}
            />
          ))}
        </div>
      </div>
    </div>
  )
}