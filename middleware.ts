import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return undefined;
  }

  // Redirect authenticated users from root URL to dashboard
  if (isLoggedIn && nextUrl.pathname === "/") {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }

  return undefined;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
