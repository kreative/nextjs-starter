import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton({ count }: { count: number }) {
  return (
    <div className="border-2 border-neutrals-5 rounded-xl divide-y">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex justify-start items-center py-2 px-4 space-x-3"
        >
          <Skeleton className="h-6 w-6 rounded-full mr-1" />
          <Skeleton className="h-3 w-36 mb-1" />
          <Skeleton className="h-2 w-40" />
        </div>
      ))}
    </div>
  );
}
