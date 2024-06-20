import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { post, category, postToCategory, user } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { zValidator } from "@hono/zod-validator";
import { insertPostSchema } from "@/db/schema";
import { and, eq, inArray, desc } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select()
      .from(post)
      .innerJoin(user, eq(user.id, post.userId))
      .orderBy(desc(post.createdAt));

    return c.json({ data });
  })
  .get("/featured", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select()
      .from(post)
      .where(eq(post.isFeatured, true))
      .innerJoin(user, eq(user.id, post.userId))
      .orderBy(desc(post.createdAt));

    return c.json({ data });
  })
  .get("/main-posts", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select()
      .from(post)
      .where(eq(post.isFeatured, false))
      .innerJoin(user, eq(user.id, post.userId))
      .orderBy(desc(post.createdAt));

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
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");
      if (!auth.session || !auth.token?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");
      if (!auth.session || !auth.token?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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
  )
  .post(
    "/",
    zValidator(
      "json",
      insertPostSchema
        .pick({
          title: true,
          description: true,
          shortDescription: true,
          imageUrl: true,
          content: true,
          isFeatured: true,
        })
        .extend({
          categoryIds: z
            .array(z.string())
            .nonempty("Selecione ao menos uma categoria"),
        })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const values = c.req.valid("json");

      if (!auth.session || !auth.token?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const postId = uuidv4();
      const [data] = await db
        .insert(post)
        .values({
          id: postId,
          title: values.title,
          shortDescription: values.shortDescription,
          description: values.description,
          content: values.content,
          imageUrl: values.imageUrl,
          userId: auth.token?.sub,
          isFeatured: values.isFeatured,
        })
        .returning();

      const postToCategoryInserts = values.categoryIds.map((categoryId) => ({
        postId,
        categoryId,
      }));
      await db.insert(postToCategory).values(postToCategoryInserts);

      return c.json({ data });
    }
  )
  .post(
    "/post-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const values = c.req.valid("json");

      if (!auth.session || !auth.token?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await db
        .delete(postToCategory)
        .where(inArray(postToCategory.postId, values.ids));

      const data = await db
        .delete(post)
        .where(inArray(post.id, values.ids))
        .returning({
          id: post.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertPostSchema
        .pick({
          title: true,
          shortDescription: true,
          description: true,
          imageUrl: true,
          content: true,
          isFeatured: true,
        })
        .extend({
          categoryIds: z
            .array(z.string())
            .nonempty("Selecione ao menos uma categoria"),
        })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!auth.session || !auth.token?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(post)
        .set(values)
        .where(and(eq(post.id, id)))
        .returning();

      await db.delete(postToCategory).where(eq(postToCategory.postId, id));

      const postToCategoryInserts = values.categoryIds.map((categoryId) => ({
        postId: id,
        categoryId,
      }));
      await db.insert(postToCategory).values(postToCategoryInserts);

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");

      if (!auth.session || !auth.token?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      await db.delete(postToCategory).where(eq(postToCategory.postId, id));

      const [data] = await db.delete(post).where(eq(post.id, id)).returning({
        id: post.id,
      });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
