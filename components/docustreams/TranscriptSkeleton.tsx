import { Skeleton } from "@/components/ui/skeleton";

export default function TranscriptSkeleton() {
  return (
    <div className="rounded-lg bg-white/75 border border-neutrals-4 w-full py-8 px-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4 py-2">
          <div className="space-y-2">
            <Skeleton className="w-1/3 h-2" />
            <Skeleton className="w-4/5 h-2" />
            <Skeleton className="w-3/4 h-2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-1/4 h-2" />
            <Skeleton className="w-2/3 h-2" />
            <Skeleton className="w-2/3 h-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
