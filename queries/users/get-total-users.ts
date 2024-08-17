import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const getTotalUsers = () => {
  const query = useQuery({
    queryKey: ["total-users"],
    queryFn: async () => {
      const res = await client.api.protected.users["general-count"].$get();

      if (!res.ok) {
        throw new Error("Failed to fetch total comments");
      }

      const { value } = await res.json();
      return value;
    },
  });
  return query;
};
