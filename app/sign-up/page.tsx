import { Suspense } from "react";
import { PartnerSignupPageContent } from "./_components/content";

export default async function SignUpPartnerPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PartnerSignupPageContent />
    </Suspense>
  )
}