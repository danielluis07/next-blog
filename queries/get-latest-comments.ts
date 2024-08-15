import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const getLatestComments = () => {
  const query = useQuery({
    queryKey: ["latest-comments"],
    queryFn: async () => {
      const res = await client.api.protected.comments["latest-comments"].$get();

      if (!res.ok) {
        throw new Error("Failed to fetch total comments");
      }

      const data = await res.json();
      return data;
    },
  });
  return query;
};
