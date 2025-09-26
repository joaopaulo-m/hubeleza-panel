import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AffiliateHomeLoadingPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Title Skeleton */}
        <Skeleton className="h-8 w-48" />

        {/* Main Stats Grid */}
        <div className="w-full flex flex-col gap-6">
          {/* Wallet Card and Fast Actions - Interactive */}
          <div className="w-full grid grid-cols-3 gap-6 items-center">
            {/* Wallet Card Skeleton */}
            <Card className="w-full h-full border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50 col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Skeleton className="h-5 w-5" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-32 mt-4" />
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </CardContent>
            </Card>

            {/* Fast Actions Card Skeleton */}
            <Card className="w-full h-full border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Skeleton className="h-5 w-5" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-24 mt-4" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Cards Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 - Total Recebido */}
            <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Skeleton className="h-9 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Total Retirado */}
            <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Skeleton className="h-9 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 - Total de Parceiros */}
            <Card className="relative overflow-hidden border-0 hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Skeleton className="h-9 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}