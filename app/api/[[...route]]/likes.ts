import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { post, user, comment, like } from "@/db/schema";
import { insertLikeSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, count, and } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select()
      .from(like)
      .innerJoin(user, eq(user.id, like.userId))
      .innerJoin(post, eq(post.id, like.postId))
      .orderBy(desc(like.createdAt));

    return c.json({ data });
  })
  .get("/general-count", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db.select({ value: count() }).from(like);

    const { value } = data;

    return c.json({ value });
  })
  .get(
    "post/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
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
        .select({ count: count() })
        .from(like)
        .leftJoin(post, eq(like.postId, post.id))
        .where(eq(post.id, id));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ likes: data[0].count });
    }
  );

export default app;
