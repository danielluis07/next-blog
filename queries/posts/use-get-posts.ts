import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPosts = () => {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await client.api.protected.posts.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
