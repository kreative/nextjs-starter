import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/Container";

export default function ApptPageSkeleton(): JSX.Element {
  return (
    <div>
      <Container>
        <Skeleton className="w-[25%] h-[12px] mb-4 mt-14" />
        <Skeleton className="h-8 w-[65%] mb-6" />
        <div className="flex justify-start items-center space-x-3">
          <Skeleton className="w-[100px] h-[8px]" />
          <Skeleton className="w-[100px] h-[8px]" />
          <Skeleton className="w-[100px] h-[8px]" />
        </div>
      </Container>
      <div className="border-b-2 border-b-black/10 w-full mt-4 mb-8" />
      <Container>
        <Skeleton className="w-[15%] h-[12px] mb-8" />
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="mb-4">
              <Skeleton className={`w-[50%] h-[6px] mb-2`} />
              <Skeleton className={`w-[65%] h-[6px] mb-2`} />
              <Skeleton className={`w-[47%] h-[6px] mb-2`} />
              <Skeleton className={`w-[55%] h-[6px] mb-2`} />
              <Skeleton className={`w-[65%] h-[6px] mb-2`} />
              <Skeleton className={`w-[75%] h-[6px] mb-2`} />
            </div>
            <div className="mb-4">
              <Skeleton className={`w-[50%] h-[6px] mb-2`} />
              <Skeleton className={`w-[65%] h-[6px] mb-2`} />
              <Skeleton className={`w-[65%] h-[6px] mb-2`} />
              <Skeleton className={`w-[78%] h-[6px] mb-2`} />
              <Skeleton className={`w-[47%] h-[6px] mb-2`} />
              <Skeleton className={`w-[35%] h-[6px] mb-2`} />
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
