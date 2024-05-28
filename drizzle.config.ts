import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
