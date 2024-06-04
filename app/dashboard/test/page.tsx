import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="h-full">
      <Card className="size-full px-2 pt-2 space-y-3">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-56 h-10" />
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-24 h-10" />
      </Card>
    </div>
  );
};

export default Loading;
