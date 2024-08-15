import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const getTotalComments = () => {
  const query = useQuery({
    queryKey: ["total-comments"],
    queryFn: async () => {
      const res = await client.api.protected.comments["general-count"].$get();

      if (!res.ok) {
        throw new Error("Failed to fetch total comments");
      }

      const { value } = await res.json();
      return value;
    },
  });
  return query;
};
