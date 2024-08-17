import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const getNotifications = () => {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await client.api.protected.notifications.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch total comments");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
