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
import { createInsertSchema } from "drizzle-zod";

export const notificationType = pgEnum("notification_type", [
  "NEW_USER",
  "NEW_COMMENT",
]);

export const role = pgEnum("role", ["ADMIN", "USER"]);

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  image: text("image"),
  role: role("role").default("ADMIN").notNull(),
  emailVerified: timestamp("emailVerified", {
    withTimezone: true,
  }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type"),
  provider: text("provider"),
  providerAccountId: text("providerAccountId"),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const post = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("short_description"),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  content: text("content").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  likes: integer("likes").default(0),
  userId: uuid("user_Id")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const category = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
});

export const postToCategory = pgTable(
  "post_to_category",
  {
    postId: uuid("post_Id")
      .references(() => post.id)
      .notNull(),
    categoryId: uuid("category_Id")
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
  postId: uuid("post_Id")
    .references(() => post.id)
    .notNull(),
  authorId: uuid("author_Id")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const notification = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: notificationType("notification_type").notNull(),
  message: text("message").notNull(),
  userId: uuid("user_Id").references(() => user.id, { onDelete: "set null" }),
  viewed: boolean("viewed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertPostSchema = createInsertSchema(post);
export const insertCategorySchema = createInsertSchema(category);
