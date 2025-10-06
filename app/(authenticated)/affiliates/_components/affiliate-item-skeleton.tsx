import { Skeleton } from "@/components/ui/skeleton";

export function AffiliateItemSkeleton() {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-5 h-5 rounded-sm" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-5 w-40 rounded-full" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-5 w-40 rounded-full" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-4 w-4" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton className="h-4 w-4" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </td>
    </tr>
  );
}
