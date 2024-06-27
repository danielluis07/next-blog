import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { post, category, postToCategory, user } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, or, ilike, and } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select()
      .from(post)
      .innerJoin(user, eq(user.id, post.userId))
      .orderBy(desc(post.createdAt));

    return c.json({ data });
  })
  .get("/featured", async (c) => {
    const data = await db
      .select()
      .from(post)
      .where(and(eq(post.isFeatured, true), eq(post.isPublished, true)))
      .innerJoin(user, eq(user.id, post.userId))
      .orderBy(desc(post.createdAt));

    return c.json({ data });
  })
  .get("/latest-posts", async (c) => {
    const data = await db
      .select()
      .from(post)
      .where(and(eq(post.isFeatured, false), eq(post.isPublished, true)))
      .innerJoin(user, eq(user.id, post.userId))
      .orderBy(desc(post.createdAt));

    return c.json({ data });
  })
  .get("/nba-posts", async (c) => {
    const data = await db
      .select()
      .from(post)
      .where(and(eq(post.isPublished, true), eq(post.league, "NBA")))
      .innerJoin(user, eq(user.id, post.userId))
      .orderBy(desc(post.createdAt));

    return c.json({ data });
  })
  .get("/nfl-posts", async (c) => {
    const data = await db
      .select()
      .from(post)
      .where(and(eq(post.isPublished, true), eq(post.league, "NFL")))
      .innerJoin(user, eq(user.id, post.userId))
      .orderBy(desc(post.createdAt));

    return c.json({ data });
  })
  .get(
    "/search",
    zValidator(
      "query",
      z.object({ q: z.string().min(1, "Query parameter is required") })
    ),
    async (c) => {
      const { q } = c.req.valid("query");

      if (!q) {
        return c.json({ error: "Missing query" }, 400);
      }

      const data = await db
        .select()
        .from(post)
        .innerJoin(user, eq(user.id, post.userId))
        .where(
          or(ilike(post.title, `%${q}%`), ilike(post.description, `%${q}%`))
        )
        .orderBy(post.createdAt);

      if (data.length === 0) {
        return c.json({ data: [] }, 200);
      }

      return c.json({ data });
    }
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select()
        .from(post)
        .innerJoin(user, eq(user.id, post.userId))
        .where(eq(post.id, id));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .get(
    "/:id/categories",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const data = await db
        .select()
        .from(category)
        .innerJoin(postToCategory, eq(postToCategory.categoryId, category.id))
        .where(eq(postToCategory.postId, id));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      const categories = data.map((item) => item.category);

      return c.json({ data: categories });
    }
  );

export default app;
