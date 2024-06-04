import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { post, postToCategory } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { zValidator } from "@hono/zod-validator";
import { insertPostSchema } from "@/db/schema";

const app = new Hono()
  .get("/", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: post.id,
      })
      .from(post);
    return c.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      insertPostSchema
        .pick({
          title: true,
          imageUrl: true,
          content: true,
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
          content: values.content,
          userId: auth.token?.sub,
        })
        .returning();

      const postToCategoryInserts = values.categoryIds.map((categoryId) => ({
        postId,
        categoryId,
      }));
      await db.insert(postToCategory).values(postToCategoryInserts);

      return c.json({ data });
    }
  );

export default app;
