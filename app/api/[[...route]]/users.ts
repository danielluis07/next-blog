import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const createUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
});

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: user.id,
        name: user.name,
      })
      .from(user);
    return c.json({ data });
  })
  .post("/create-user", zValidator("json", createUserSchema), async (c) => {
    const values = c.req.valid("json");
    console.log(values);
  });

export default app;
