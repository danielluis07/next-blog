import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { notification } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { desc, eq, and, inArray } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const auth = c.get("authUser");

    if (!auth.session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.select().from(notification);
    return c.json({ data });
  })
  .post(
    "/notification-delete",
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
        .delete(notification)
        .where(inArray(notification.id, values.ids))
        .returning({
          id: notification.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/notifications-viewed",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()), // Array of notification IDs to mark as viewed
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const values = c.req.valid("json");

      if (!auth.session || !auth.token?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (values.ids.length === 0) {
        return c.json({ error: "No notification IDs provided" }, 400);
      }

      const data = await db
        .update(notification)
        .set({ viewed: true })
        .where(inArray(notification.id, values.ids))
        .returning({
          id: notification.id,
          viewed: notification.viewed,
        });

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
        .delete(notification)
        .where(and(eq(notification.id, id)))
        .returning({
          id: notification.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
