import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import publicPosts from "./public-posts";
import users from "./users";
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

app.use(
  "*",
  cors({
    origin: "http://localhost:3001",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth/*", authHandler());

app.use("/protected/*", verifyAuth());

const routes = app
  .route("/public/users", users)
  .route("/protected/posts", posts)
  .route("/protected/categories", categories)
  .route("/public/posts", publicPosts);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
