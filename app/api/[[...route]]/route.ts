import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import publicPosts from "./public-posts";
import users from "./users";
import publicUsers from "./public-users";
import Google from "@auth/core/providers/google";
import posts from "./posts";
import publicComments from "./public-comments";
import categories from "./categories";
import publicLikes from "./public-likes";
import notifications from "./notifications";
import likes from "./likes";
import comments from "./comments";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

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

app.use("/protected/*", verifyAuth());

const routes = app
  .route("/protected/users", users)
  .route("/protected/likes", likes)
  .route("/protected/comments", comments)
  .route("/protected/notifications", notifications)
  .route("/public/users", publicUsers)
  .route("/protected/posts", posts)
  .route("/public/comments", publicComments)
  .route("/public/likes", publicLikes)
  .route("/protected/categories", categories)
  .route("/public/posts", publicPosts);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
