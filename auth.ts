import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import authConfig from "./auth.config";
import { db } from "./db/drizzle";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
      }

      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
