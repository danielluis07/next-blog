import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="h-full">
      <Card className="size-full px-2 pt-2">
        <div className="space-y-3">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-[420px] h-12" />
        </div>
        <div className="mt-8 border border-gray-300 rounded-lg p-3">
          <div className="flex border-b pb-2">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="w-24 h-5 ml-32" />
          </div>
          <div className="mt-8 space-y-5">
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex pb-2">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Loading;
