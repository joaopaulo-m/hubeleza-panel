import { Skeleton } from "@/components/ui/skeleton";

export function AffiliateTransactionItemSkeleton() {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-5 w-8 rounded-full" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-4 w-8" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-4 w-8" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-4 w-24" />
      </td>
    </tr>
  )
}