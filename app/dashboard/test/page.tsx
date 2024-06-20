import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Test } from "./_components/test";

const Loading = () => {
  return (
    <div>
      <Test />
    </div>
  );
};

export default Loading;
