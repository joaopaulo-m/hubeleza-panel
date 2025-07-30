import { Skeleton } from "@/components/ui/skeleton"

export default function TreatmentsLoadingPage() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tratamentos</h1>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Grid de skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <Skeleton className="h-5 w-5" />
            </div>

            <Skeleton className="h-6 w-3/4 mb-4" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
