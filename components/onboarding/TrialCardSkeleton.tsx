import { Skeleton } from "../ui/skeleton";

export default function TrialCardSkeleton() {
  return (
    <div className="p-6 border-2 border-neutrals-4 rounded-xl bg-white">
      <Skeleton className="h-4 w-1/5 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-4" />
      <Skeleton className="h-24 w-2/5 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-[90%] mb-6" />
      <Skeleton className="h-5 w-[40%] mb-2" />
      <Skeleton className="h-5 w-[60%] mb-2" />
      <Skeleton className="h-5 w-[50%] mb-6" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
