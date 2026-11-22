-- Migration: 0001_create_blogs_tables

CREATE TABLE IF NOT EXISTS "categories" (
  "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS "tags" (
  "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "cover_image" TEXT,
  "category_id" TEXT REFERENCES "categories"("id") ON DELETE SET NULL,
  "tags" TEXT NOT NULL DEFAULT '[]',
  "read_time_minutes" INTEGER NOT NULL DEFAULT 3,
  "is_draft" INTEGER NOT NULL DEFAULT 0,
  "published_at" INTEGER DEFAULT (unixepoch() * 1000),
  "author_id" TEXT,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  "updated_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX IF NOT EXISTS "idx_blog_posts_slug" ON "blog_posts"("slug");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_published" ON "blog_posts"("is_draft", "published_at");
