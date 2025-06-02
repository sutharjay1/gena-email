import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

export const MessageSkeleton = memo(() => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pb-44 pt-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
});

MessageSkeleton.displayName = "MessageSkeleton";
