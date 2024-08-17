import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { user, like, insertLikeSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { desc, eq, count } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(user);
    return c.json({ data });
  })
  .get("/latest", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.role, "USER"))
      .limit(10)
      .orderBy(desc(user.createdAt));
    return c.json({ data });
  })
  .get("/general-count", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .select({ value: count() })
      .from(user)
      .where(eq(user.role, "USER"));

    const { value } = data;

    return c.json({ value });
  })
  .get(
    "liked-posts/user/:userId",
    zValidator("param", insertLikeSchema.pick({ userId: true })),
    async (c) => {
      const auth = c.get("authUser");

      if (!auth.session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { userId } = c.req.valid("param");
      const data = await db.select().from(like).where(eq(like.userId, userId));

      return c.json({ data });
    }
  )
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");

      if (!auth.session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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
  );

export default app;
