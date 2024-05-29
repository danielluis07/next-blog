import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { admin, insertAdminSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: admin.id,
        name: admin.name,
      })
      .from(admin);
    return c.json({ data });
  })
  .post("/", zValidator("json", insertAdminSchema), async (c) => {
    return c.json({});
  });

export default app;
