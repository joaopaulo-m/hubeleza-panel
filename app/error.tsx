'use client'

import { ServerCrash } from "lucide-react"
import Link from "next/link"

export default function Error() {
  return (
    <div className="flex min-h-screen h-full items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <ServerCrash className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Algo deu errado</h1>
        <p className="text-gray-600">
          Ocorreu um erro inesperado. Nossa equipe já está trabalhando para corrigir.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {}}
            className="bg-red-600 text-white font-medium px-6 py-2 rounded-xl hover:bg-red-700 transition"
          >
            Tentar novamente
          </button>

          <Link
            href="/dashboard"
            className="bg-gray-100 text-gray-800 font-medium px-6 py-2 rounded-xl hover:bg-gray-200 transition"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
