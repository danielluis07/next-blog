import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { post, user, comment } from "@/db/schema";
import { insertCommentSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, count } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select()
      .from(comment)
      .innerJoin(user, eq(user.id, comment.authorId))
      .innerJoin(post, eq(post.id, comment.postId))
      .orderBy(desc(comment.createdAt));

    return c.json({ data });
  })
  .get("/latest-comments", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select()
      .from(comment)
      .innerJoin(user, eq(user.id, comment.authorId))
      .innerJoin(post, eq(post.id, comment.postId))
      .orderBy(desc(post.createdAt))
      .limit(5);

    return c.json({ data });
  })
  .get("/general-count", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db.select({ value: count() }).from(comment);

    const { value } = data;

    return c.json({ value });
  });

export default app;
