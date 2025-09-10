import { Suspense } from "react";

import DefinePasswordPageContent from "./_components/content";

export default async function DefinePasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DefinePasswordPageContent />
    </Suspense>
  )
}