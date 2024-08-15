import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const getLatestUsers = () => {
  const query = useQuery({
    queryKey: ["latest-users"],
    queryFn: async () => {
      const res = await client.api.protected.users["latest"].$get();

      if (!res.ok) {
        throw new Error("Failed to fetch latest users");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
