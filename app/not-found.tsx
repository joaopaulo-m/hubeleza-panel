import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen h-full items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-yellow-100 p-4 rounded-full">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Página não encontrada</h1>
        <p className="text-gray-600">
          A página que você está procurando não existe ou foi movida.
        </p>

        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
