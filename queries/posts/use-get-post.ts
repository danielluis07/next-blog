import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPost = (id?: string) => {
  const query = useQuery({
    enabled: !!id, // the query will only be executed if we have the id
    queryKey: ["post", { id }],
    queryFn: async () => {
      const res = await client.api.protected.posts[":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch post");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
