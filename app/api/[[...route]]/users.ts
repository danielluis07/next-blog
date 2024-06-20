import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";

const app = new Hono().get("/", async (c) => {
  console.log(c.req.header("Authorization"));
  const data = await db
    .select({
      id: user.id,
      name: user.name,
    })
    .from(user);
  return c.json({ data });
});

export default app;
