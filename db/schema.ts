import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const notificationType = pgEnum("notificationType", [
  "NEW_USER",
  "NEW_COMMENT",
]);

export const admin = pgTable("admin", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified"),
  imageUrl: text("imageUrl"),
  password: text("password"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("adminId")
    .references(() => admin.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type"),
  provider: text("provider"),
  providerAccountId: text("providerAaccountId"),
  refreshToken: text("refreshToken"),
  accessToken: text("accessToken"),
  expiresAt: integer("expiresAt"),
  tokenType: text("tokenType"),
  scope: text("scope"),
  idToken: text("idToken"),
  sessionState: text("sessionState"),
});

export const verificationToken = pgTable("verificationToken", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const passwordResetToken = pgTable("passwordResetToken", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const twoFactorToken = pgTable("twoFactorToken", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const twoFactorConfirmation = pgTable("twoFactorConfirmation", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("adminId")
    .references(() => admin.id, { onDelete: "cascade" })
    .unique(),
});

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  imageUrl: text("imageUrl"),
  emailVerified: timestamp("emailVerified", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

export const post = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  published: boolean("published").default(false),
  adminId: uuid("adminId")
    .references(() => admin.id)
    .notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

export const category = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
});

export const postToCategory = pgTable(
  "postToCategory",
  {
    postId: uuid("postId")
      .references(() => post.id)
      .notNull(),
    categoryId: uuid("categoryId")
      .references(() => category.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.postId, table.categoryId] }),
    };
  }
);

export const comment = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  postId: uuid("postId")
    .references(() => post.id)
    .notNull(),
  authorId: uuid("authorId")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

export const notification = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: notificationType("notificationType").default("NEW_USER").notNull(),
  message: text("message").notNull(),
  adminId: uuid("adminId").references(() => admin.id, { onDelete: "set null" }),
  viewed: boolean("viewed").default(false),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

export const insertAdminSchema = createInsertSchema(admin);
