import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPostsCount = () => {
  const query = useQuery({
    queryKey: ["posts-count"],
    queryFn: async () => {
      const res = await client.api.protected.posts["posts-count"].$get();

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
