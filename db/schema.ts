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

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminSessions = sqliteTable("admin_sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id"),
  isDefaultAdmin: integer("is_default_admin", { mode: "boolean" }).notNull().default(false),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  token: text("token").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  used: integer("used", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const productItems = sqliteTable("product_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  overviewEn: text("overview_en").notNull().default(""),
  overviewTr: text("overview_tr").notNull().default(""),
  featuresEn: text("features_en").notNull().default(""),
  featuresTr: text("features_tr").notNull().default(""),
  usesEn: text("uses_en").notNull().default(""),
  usesTr: text("uses_tr").notNull().default(""),
  imageKey: text("image_key"),
  galleryKeys: text("gallery_keys").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const productOptions = sqliteTable("product_options", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  optionType: text("option_type").notNull(),
  productItemId: integer("product_item_id"),
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  bodyEn: text("body_en").notNull().default(""),
  bodyTr: text("body_tr").notNull().default(""),
  imageKey: text("image_key"),
  galleryKeys: text("gallery_keys").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
