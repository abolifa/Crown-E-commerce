import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loader2 = () => {
  return (
    <div className="flex flex-col w-full gap-5">
      <div className="w-full flex items-center justify-start gap-5">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-full flex-1 h-8 rounded-full" />
      </div>
      <Separator />
      <div className="w-full flex flex-col gap-5">
        <Skeleton className="w-full h-8 rounded-2xl" />
        <Skeleton className="w-full h-8 rounded-2xl" />
        <Skeleton className="w-full h-8 rounded-2xl" />
      </div>
    </div>
  );
};

export default Loader2;
