import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const getUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await client.api.users.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const { data } = await res.json();

      return data;
    },
  });

  return query;
};
