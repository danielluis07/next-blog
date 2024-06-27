import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetLatestPosts = () => {
  const query = useQuery({
    queryKey: ["latest-posts"],
    queryFn: async () => {
      const res = await client.api.protected.posts["latest-posts"].$get();

      if (!res.ok) {
        throw new Error("Failed to fetch latest posts");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
