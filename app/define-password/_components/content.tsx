'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { sendToDefinePasswordAction } from "@/lib/api/actions/auth";

export default function DefinePasswordPageContent() {
  const [error, setError] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  const params = new URLSearchParams(searchParams.toString())

  useEffect(() => {
    async function sendToDefinePassword() {
      const { success } = await sendToDefinePasswordAction(params.get('id')?.toString() || "")

      if (success) {
        router.push("/partner/home")
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