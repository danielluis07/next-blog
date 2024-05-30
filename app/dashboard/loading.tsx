import { LoadingSpinner } from "@/components/loading-spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
