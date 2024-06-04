import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { and, eq, inArray } from "drizzle-orm";
import { category } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { insertCategorySchema } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

const app = new Hono()
  .get("/", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session || !auth.token?.sub) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.select().from(category);
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
        .select({
          id: category.id,
          name: category.name,
        })
        .from(category)
        .where(eq(category.id, id));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      insertCategorySchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const values = c.req.valid("json");

      if (!auth.session || !auth.token?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(category)
        .values({
          id: uuidv4(),
          name: values.name,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/category-delete",
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

      const data = await db
        .delete(category)
        .where(inArray(category.id, values.ids))
        .returning({
          id: category.id,
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
      insertCategorySchema.pick({
        name: true,
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
        .update(category)
        .set(values)
        .where(and(eq(category.id, id)))
        .returning();

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

      const [data] = await db
        .delete(category)
        .where(and(eq(category.id, id)))
        .returning({
          id: category.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
