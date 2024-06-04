import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import {
  authHandler,
  initAuthConfig,
  verifyAuth,
  type AuthConfig,
} from "@hono/auth-js";
import users from "./users";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import posts from "./posts";
import categories from "./categories";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(
  "*",
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
  }))
);

app.use("/auth/*", authHandler());

app.use("/*", verifyAuth());

const routes = app
  .route("/users", users)
  .route("/posts", posts)
  .route("/categories", categories);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
