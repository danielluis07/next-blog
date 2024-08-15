import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const getUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await client.api.protected.users.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch latest users");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
