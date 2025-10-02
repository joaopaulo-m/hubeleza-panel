'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { sendToDefinePasswordAction } from "@/lib/api/actions/auth";
import { AccountType } from "@/types/enums/account-type";

export default function DefinePasswordPageContent() {
  const [error, setError] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  const params = new URLSearchParams(searchParams.toString())

  useEffect(() => {
    async function sendToDefinePassword() {
      const { success, accountType } = await sendToDefinePasswordAction(params.get('id')?.toString() || "")

      if (success) {
        setTimeout(() => {
          if (accountType && accountType === AccountType.OPERATOR) {
            router.push("/operator/home")
          }

          if (accountType && accountType === AccountType.AFFILIATE) {
            router.push("/affiliate/home")
          }
        }, 250)
      } else {
        setError(true)
      }
    }

    sendToDefinePassword()
  }, [searchParams, params])

  return (
    <>
      {!error ? (
        <div>Carregando...</div>
      ) : (
        <div>Erro inesperado</div>
      )}
    </>
  )
}