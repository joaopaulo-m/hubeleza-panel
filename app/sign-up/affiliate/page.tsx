import { Suspense } from "react";

import { AffiliateSignupPageContent } from "./_components/content";

export default async function SignUpAffiliatePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AffiliateSignupPageContent />
    </Suspense>
  )
}