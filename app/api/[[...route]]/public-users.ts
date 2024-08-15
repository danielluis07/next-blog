import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { insertUserSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const data = await db
        .select({
          id: user.id,
          name: user.name,
        })
        .from(user)
        .where(eq(user.id, id));
      return c.json({ data });
    }
  )
  .post("/create-user", zValidator("json", insertUserSchema), async (c) => {
    const values = c.req.valid("json");

    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, values.email))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ message: "User already exists" });
    }

    const [data] = await db.insert(user).values(values).returning();
    return c.json({ data });
  });

export default app;
