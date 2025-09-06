import { Skeleton } from '@/components/ui/skeleton';

export function LeadItemSkeleton() {
 return (
   <tr className="hover:bg-gray-50 transition-colors">
     <td className="px-6 py-4 whitespace-nowrap">
       <div className="flex items-center">
         <div className="flex-shrink-0 h-10 w-10">
           <Skeleton className="h-10 w-10 rounded-full" />
         </div>
         <div className="ml-4">
           <Skeleton className="h-4 w-32" />
         </div>
       </div>
     </td>

     <td className="px-6 py-4 whitespace-nowrap">
       <div className="flex items-center gap-2">
         <Skeleton className="h-4 w-4 rounded" />
         <Skeleton className="h-4 w-28" />
       </div>
     </td>

     <td className="px-6 py-4 whitespace-nowrap">
       <div className="flex items-center gap-2">
         <Skeleton className="h-4 w-4 rounded" />
         <Skeleton className="h-4 w-20" />
       </div>
     </td>

     <td className="px-6 py-4">
       <div className="space-y-2">
         <div className="flex flex-wrap gap-1">
           <Skeleton className="h-5 w-16 rounded-full" />
           <Skeleton className="h-5 w-20 rounded-full" />
         </div>
       </div>
     </td>

     <td className="px-6 py-4 whitespace-nowrap">
       <div className="space-y-1">
         <Skeleton className="h-4 w-20" />
         <Skeleton className="h-3 w-12" />
       </div>
     </td>
   </tr>
 );
}