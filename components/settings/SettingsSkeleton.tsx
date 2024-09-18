import { Skeleton } from "@/components/ui/skeleton";

export function ChangeTitleSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-full mb-3" />
      <Skeleton className="h-2 w-[95%] mb-2" />
      <Skeleton className="h-2 w-[50%]" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-full mb-3" />
    </div>
  );
}

export function SubscriptionCardSkeleton() {
  return (
    <div className="p-6 border-2 border-neutrals-5 rounded-xl bg-neutrals-2">
      <Skeleton className="h-8 w-1/3 mb-3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
