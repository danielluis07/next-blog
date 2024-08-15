import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const getTotalViews = () => {
  const query = useQuery({
    queryKey: ["total-views"],
    queryFn: async () => {
      const res = await client.api.protected.posts.views.sum.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch total views");
      }

      const { value } = await res.json();
      return value;
    },
  });
  return query;
};
