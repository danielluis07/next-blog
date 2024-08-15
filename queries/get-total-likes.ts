import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const getTotalLikes = () => {
  const query = useQuery({
    queryKey: ["total-likes"],
    queryFn: async () => {
      const res = await client.api.protected.likes["general-count"].$get();

      if (!res.ok) {
        throw new Error("Failed to fetch total likes");
      }

      const { value } = await res.json();
      return value;
    },
  });
  return query;
};
