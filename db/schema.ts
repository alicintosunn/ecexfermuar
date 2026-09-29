import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentSections = sqliteTable("content_sections", {
  key: text("key").primaryKey(),
  titleEn: text("title_en").notNull().default(""),
  titleTr: text("title_tr").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  bodyTr: text("body_tr").notNull().default(""),
  imageKey: text("image_key"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  excerptEn: text("excerpt_en").notNull().default(""),
  excerptTr: text("excerpt_tr").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  contentTr: text("content_tr").notNull().default(""),
  imageKey: text("image_key"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
