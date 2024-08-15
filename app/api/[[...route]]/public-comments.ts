import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { post, user, comment } from "@/db/schema";
import { insertCommentSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, desc } from "drizzle-orm";

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
        .from(comment)
        .innerJoin(user, eq(user.id, comment.authorId))
        .innerJoin(post, eq(post.id, comment.postId))
        .where(eq(comment.id, id));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .get(
    "/post/:id",
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
        .select({
          commentId: comment.id,
          text: comment.text,
          authorId: comment.authorId,
          authorName: user.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          userId: user.id,
          email: user.email,
          imageUrl: user.image,
          name: user.name,
          userRole: user.role,
          emailVerified: user.emailVerified,
        })
        .from(comment)
        .innerJoin(user, eq(user.id, comment.authorId))
        .innerJoin(post, eq(post.id, comment.postId))
        .where(eq(post.id, id));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/create-comment",
    zValidator("json", insertCommentSchema),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db.insert(comment).values(values).returning();

      return c.json({ data });
    }
  );

export default app;
