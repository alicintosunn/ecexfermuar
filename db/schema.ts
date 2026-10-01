import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const contentSections = pgTable("content_sections", {
  key: text("key").primaryKey(),
  titleEn: text("title_en").notNull().default(""),
  titleTr: text("title_tr").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  bodyTr: text("body_tr").notNull().default(""),
  imageKey: text("image_key"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  excerptEn: text("excerpt_en").notNull().default(""),
  excerptTr: text("excerpt_tr").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  contentTr: text("content_tr").notNull().default(""),
  imageKey: text("image_key"),
  published: boolean("published").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminSessions = pgTable("admin_sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id"),
  isDefaultAdmin: boolean("is_default_admin").notNull().default(false),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  token: text("token").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const productItems = pgTable("product_items", {
  id: serial("id").primaryKey(),
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

export const productOptions = pgTable("product_options", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  optionType: text("option_type").notNull(),
  productItemId: integer("product_item_id"),
  productItemIds: text("product_item_ids").notNull().default("[]"),
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

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const popups = pgTable("popups", {
  id: serial("id").primaryKey(),
  language: text("language").notNull().default("en"),
  message: text("message").notNull().default(""),
  imageKey: text("image_key"),
  videoKey: text("video_key"),
  published: boolean("published").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
