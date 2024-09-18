import { cn } from "@/lib/utils";

export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <main
      className={cn(
        "max-w-[--max-width] mx-auto z-20 relative px-4 min-[840px]:px-0",
        className
      )}
    >
      {children}
    </main>
  );
}
