import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { post, user, like, notification } from "@/db/schema";
import { insertLikeSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, count, and } from "drizzle-orm";
import { pusherServer } from "@/lib/pusherServer";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select()
      .from(like)
      .innerJoin(user, eq(user.id, like.userId))
      .innerJoin(post, eq(post.id, like.postId))
      .orderBy(desc(like.createdAt));

    return c.json({ data });
  })
  .get("/general-count", async (c) => {
    const data = await db.select({ count: count() }).from(like);

    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ likes: data[0].count });
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
      const { id } = c.req.valid("param");

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
  )
  .get(
    "post/:postId/user/:userId",
    zValidator("param", insertLikeSchema.pick({ postId: true, userId: true })),
    async (c) => {
      const { postId, userId } = c.req.valid("param");
      const data = await db
        .select()
        .from(like)
        .where(and(eq(like.postId, postId), eq(like.userId, userId)));

      const liked = data.length > 0;

      return c.json({ liked });
    }
  )
  .post(
    "post/create-like",
    zValidator("json", insertLikeSchema.pick({ postId: true, userId: true })),
    async (c) => {
      const { postId, userId } = c.req.valid("json");

      const existingLike = await db
        .select()
        .from(like)
        .where(and(eq(like.postId, postId), eq(like.userId, userId)));

      if (existingLike.length > 0) {
        return c.json({ error: "User already liked this post" }, 400);
      }

      const [data] = await db
        .insert(like)
        .values({ postId, userId })
        .returning();

      if (data) {
        await db
          .insert(notification)
          .values({
            userId,
            type: "NEW_LIKE",
            message: "Alguém curtiu seu post",
            postId,
            viewed: false,
          })
          .returning();

        await pusherServer.trigger("notifications", "likes:new", {
          message: "Alguém curtiu seu post",
          userId,
          postId,
          createdAt: new Date().toISOString(),
          type: "NEW_LIKE",
        });
      }

      return c.json({ data });
    }
  )
  .delete(
    "post/remove-like",
    zValidator("json", insertLikeSchema.pick({ postId: true, userId: true })),
    async (c) => {
      const { postId, userId } = c.req.valid("json");

      const existingLike = await db
        .select()
        .from(like)
        .where(and(eq(like.postId, postId), eq(like.userId, userId)));

      if (existingLike.length === 0) {
        return c.json({ error: "Like not found" }, 404);
      }

      const [data] = await db
        .delete(like)
        .where(and(eq(like.postId, postId), eq(like.userId, userId)))
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
