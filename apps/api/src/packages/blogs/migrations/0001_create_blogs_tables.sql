-- Migration: 0001_create_blogs_tables

CREATE TABLE IF NOT EXISTS "categories" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "tags" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "cover_image" TEXT,
  "category_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL,
  "tags" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "read_time_minutes" INTEGER NOT NULL DEFAULT 3,
  "is_draft" BOOLEAN NOT NULL DEFAULT FALSE,
  "published_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "author_id" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_blog_posts_slug" ON "blog_posts"("slug");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_published" ON "blog_posts"("is_draft", "published_at");
