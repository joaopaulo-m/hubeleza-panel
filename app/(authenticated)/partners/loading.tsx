// app/(sua-rota)/partners/loading.tsx
export default function PartnersLoadingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-36 bg-gray-200 rounded" />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <div className="h-8 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
